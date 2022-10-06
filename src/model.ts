/**
 * The ingest JSON format of the graph viewer
 *
 * The top level type of the JSON is GraphDef.
 */

import { DirectedGraph } from "graphology";
import Sigma from "sigma";
import { NodeDisplayData } from "sigma/types";

export type NodeId = string;

export interface NodeProps {
    googleSearch: string;
}

/** One node (point) in the graph */
export interface Node {
    /** Properties to show in the UI when the node is highlighted.
     *
     * You can put anything you'd like in here, the stuff
     * in NodeProps is optional properties that are handled specially
     */
    props?: Partial<NodeProps> & Record<string, string>;

    /** Color of the node; defaults to "black" */
    color?: string;

    /** Display name of the node; defaults to the ID */
    label?: string;

    /** Weight of the node, defaults to the sum of the edge weights if absent */
    // FIXME: should this weighting behaviour be configurable? If so, how?
    weight?: number;
}

/** An edge in a directed graph */
export interface Edge {
    from: NodeId;
    to: NodeId;

    /** Label to show on the edge. If missing, the amount will be shown. */
    label?: string;

    /** Amount to show on the edge. This is assumed to be parseable as a float,
     * and is used to determine edge weights by default */
    amount?: string;
}

export interface GraphDef {
    /** Title to show on the graph */
    title?: string;

    nodes: { [id: NodeId]: Node };
    edges: Edge[];
}

// This song and dance allows custom properties on nodes/edges with type
// safety :)

export interface NodeAttrs extends Partial<NodeDisplayData> {
    nodeDef: Node;
}

export type Graph = DirectedGraph<NodeAttrs>;

export type SigmaT = Sigma<Graph>;
