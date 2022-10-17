import { Attributes } from "graphology-types";
import Sigma from "sigma";
import { NodeDisplayData } from "sigma/types";
import { Graph, Node, NodeId, NodeProps, SigmaT } from "./model";
import ChonkyArrowProgram from "./chonkyArrows";

export interface GraphView {
    /** Emitted on selection */
    onNodeSelected: (nodeId: string, node: Node) => void;
}

// FIXME: this might be good to replace with react and TSX. the stock DOM
// stuff sucks
export class TableNodeDataView {
    table: HTMLTableElement;
    nameElem: HTMLElement;

    constructor(elem: HTMLElement) {
        this.table = elem.querySelector("[data-node-table]")!;
        this.nameElem = elem.querySelector("[data-node-name]")!;
    }

    renderProperty(intoEl: HTMLElement, id: string, value: string) {
        const SPECIALS: { [id in keyof NodeProps]: () => void } = {
            googleSearch: () => {
                const anchor = document.createElement("a");
                anchor.href = `https://google.com/search?q=${encodeURIComponent(
                    value
                )}`;
                anchor.textContent = value;

                intoEl.appendChild(anchor);
            },
        };
        const defaultRender = () => {
            intoEl.textContent = value;
        };

        // XXX: type crimes?
        const renderFunc = SPECIALS[id as keyof NodeProps] || defaultRender;
        renderFunc();
    }

    onNodeSelected(nodeId: string, node: Node) {
        if (this.table.tBodies[0]) this.table.tBodies[0].remove();

        this.nameElem.textContent = node.label || nodeId;

        const tbody = this.table.createTBody();
        for (const [prop, val] of Object.entries(node.props || {})) {
            const row = document.createElement("tr");
            const nameEl = document.createElement("td");
            const valueEl = document.createElement("td");

            nameEl.textContent = prop;
            this.renderProperty(valueEl, prop, val);

            row.appendChild(nameEl);
            row.appendChild(valueEl);
            tbody.appendChild(row);
        }
    }
}

export class SigmaGraphView implements GraphView {
    sigma: SigmaT;
    onNodeSelected: (nodeId: string, node: Node) => void = () => undefined;

    state: {
        hoveredNode: NodeId | null;
        highlightNodes: Set<NodeId> | null;
    } = { hoveredNode: null, highlightNodes: null };

    nodeReducer(node: string, data: Attributes): Partial<NodeDisplayData> {
        const res: Partial<NodeDisplayData> = { ...data };
        if (node === this.state.hoveredNode) {
            res.highlighted = true;
        }
        if (
            this.state.highlightNodes &&
            this.state.hoveredNode !== node &&
            !this.state.highlightNodes.has(node)
        ) {
            res.color = "#eee";
            res.label = "";
        }
        return res;
    }

    constructor(sigma: SigmaT) {
        this.sigma = sigma;
        this.nodeReducer = this.nodeReducer.bind(this);

        sigma.setSetting("nodeReducer", this.nodeReducer);

        sigma.addListener("clickNode", (payload) => {
            const graph = sigma.getGraph();

            const nodeDef = graph.getNodeAttribute(payload.node, "nodeDef");
            this.onNodeSelected(payload.node, nodeDef);
        });

        sigma.addListener("enterNode", (payload) => {
            const hoveredNode = payload.node;
            const graph = this.sigma.getGraph();
            this.state.highlightNodes = new Set(graph.neighbors(hoveredNode));
            this.state.hoveredNode = hoveredNode;
        });
        sigma.addListener("leaveNode", (_payload) => {
            this.state.hoveredNode = null;
            this.state.highlightNodes = null;
        });
    }

    kill() {
        this.sigma.kill();
    }
}

export class View {
    sigmaGraphView: SigmaGraphView;
    nodeDataView: TableNodeDataView;

    constructor(
        graph: Graph,
        graphContainer: HTMLElement,
        propsContainer: HTMLTableElement
    ) {
        this.nodeDataView = new TableNodeDataView(propsContainer);
        this.sigmaGraphView = new SigmaGraphView(
            new Sigma(graph, graphContainer, {
                renderEdgeLabels: true,
                edgeProgramClasses: {
                    arrow: ChonkyArrowProgram,
                },
            })
        );
        this.sigmaGraphView.onNodeSelected = (nodeId, node) =>
            this.nodeDataView.onNodeSelected(nodeId, node);
    }

    kill() {
        this.sigmaGraphView.kill();
    }
}
