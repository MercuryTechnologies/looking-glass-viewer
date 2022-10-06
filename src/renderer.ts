import Sigma from "sigma";
import { Graph, Node, NodeProps, SigmaT } from "./model";

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

    constructor(sigma: SigmaT) {
        this.sigma = sigma;

        sigma.addListener("clickNode", (payload) => {
            const graph = sigma.getGraph();

            const nodeDef = graph.getNodeAttribute(payload.node, "nodeDef");
            this.onNodeSelected(payload.node, nodeDef);
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
            })
        );
        this.sigmaGraphView.onNodeSelected = (nodeId, node) =>
            this.nodeDataView.onNodeSelected(nodeId, node);
    }

    kill() {
        this.sigmaGraphView.kill();
    }
}
