import { DirectedGraph } from "graphology";
import { circular } from "graphology-layout";
import forceAtlas2 from "graphology-layout-forceatlas2";
import { GraphDef, Graph, NodeAttrs } from "./model";

declare global {
    var graph: Graph;
}

export function jsonTextToGraphDef(text: string): GraphDef {
    const parsed = JSON.parse(text);

    const checkField = (
        obj: any,
        fieldName: string,
        check: (v: any) => boolean | void,
        required: boolean = true
    ) => {
        if (obj[fieldName] == null) {
            if (required)
                throw `required property "${fieldName}" is missing, have ${JSON.stringify(
                    obj
                )}`;
            else return;
        }
        const checkResult = check(obj[fieldName]);
        if (checkResult === false) {
            throw `field ${fieldName} fails type check`;
        }
    };

    const isString = (v: any) => typeof v === "string";
    const isNumber = (v: any) => typeof v === "number";
    const isObject = (v: any) => typeof v === "object";

    checkField(parsed, "title", isString, false);
    checkField(
        parsed,
        "nodes",
        (v) =>
            isObject(v) &&
            Object.entries(v).every(([k, v]) => {
                if (!isString(k)) {
                    return false;
                }
                checkField(v, "props", isObject, false);
                checkField(v, "color", isString, false);
                checkField(v, "label", isString, false);
                checkField(v, "weight", isNumber, false);
                return true;
            })
    );

    checkField(
        parsed,
        "edges",
        (edges) =>
            Array.isArray(edges) &&
            edges.forEach((edge: object) => {
                checkField(edge, "to", isString);
                checkField(edge, "from", isString);
            })
    );

    return parsed as GraphDef;
}

export function buildGraph(def: GraphDef): Graph {
    const graph: Graph = new DirectedGraph<NodeAttrs>();

    Object.entries(def.nodes).forEach(([id, node]) =>
        graph.addNode(id, {
            nodeDef: node,
            color: node.color,
            label: node.label || id,
        })
    );

    const createNodeIfNotExists = (name: string) => {
        if (!graph.hasNode(name)) {
            graph.addNode(name, { label: name, nodeDef: {} });
        }
    };

    def.edges.forEach((edge) => {
        let amountNum = parseFloat(edge.amount || "1");
        if (isNaN(amountNum)) {
            console.warn(
                `amount on edge ${edge.from} -> ${edge.to} "${edge.amount}" is unparseable`
            );
            amountNum = 1;
        }

        createNodeIfNotExists(edge.from);
        createNodeIfNotExists(edge.to);

        graph.addEdge(edge.from, edge.to, {
            label: edge.label || edge.amount,
            weight: amountNum,
            type: "arrow",
            size: 3,
        });
    });

    const minSize = 5,
        maxSize = 25;
    const sizes = graph
        .mapNodes((node) => graph.getNodeAttribute(node, "nodeDef").weight)
        .filter((n) => n != null) as number[];
    const minExplicitNodeSize = Math.min(...sizes);
    const maxExplicitNodeSize = Math.max(...sizes);
    console.log(minExplicitNodeSize, maxExplicitNodeSize);

    // Use total edge weights for node size
    const totalTransfersByNode = graph
        .nodes()
        .map((node) =>
            graph.reduceEdges(
                node,
                (acc, _edge, edgeAttrs) => acc + edgeAttrs.weight,
                0
            )
        );
    const minXfers = Math.min(...totalTransfersByNode);
    const maxXfers = Math.max(...totalTransfersByNode);
    const scaledSizeFor = (transferAmount: number) =>
        minSize +
        ((transferAmount - minXfers) / (maxXfers - minXfers)) *
            (maxSize - minSize);
    const scaledExplicitSizeFor = (size: number) =>
        minSize +
        ((size - minExplicitNodeSize) /
            (maxExplicitNodeSize - minExplicitNodeSize)) *
            (maxSize - minSize);
    graph.forEachNode((node) => {
        const totalTransfers = graph.reduceEdges(
            node,
            (acc, _edge, edgeAttrs) => acc + edgeAttrs.weight,
            0
        );
        const nodeAttrs = graph.getNodeAttributes(node);
        const explicitSize =
            nodeAttrs.nodeDef.weight != null
                ? scaledExplicitSizeFor(nodeAttrs.nodeDef.weight)
                : null;
        graph.setNodeAttribute(
            node,
            "size",
            explicitSize ?? scaledSizeFor(totalTransfers)
        );
    });

    // Position nodes on a circle, then run Force Atlas 2 for a while to get
    // proper graph layout:
    circular.assign(graph);
    const settings = forceAtlas2.inferSettings(graph);
    forceAtlas2.assign(graph, { settings, iterations: 600 });

    // for debugging
    globalThis.graph = graph;

    return graph;
}
