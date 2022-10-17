/**
 * Sigma.js WebGL Renderer Edge Arrow Program
 * ===========================================
 *
 * Compound program rendering edges as an arrow from the source to the target.
 * @module
 *
 * This file taken from sigma.js.
 * See https://github.com/jacomyal/sigma.js/blob/e187ba5b567eb359f2b4e438987785da73684667/src/rendering/webgl/programs/edge.arrow.ts
 */
import { createEdgeCompoundProgram } from "sigma/rendering/webgl/programs/common/edge";
import ChonkyArrowHeadProgram from "./edge.arrowHead";
import EdgeClampedProgram from "sigma/rendering/webgl/programs/edge.clamped";

const ChonkyArrowProgram = createEdgeCompoundProgram([
    EdgeClampedProgram,
    ChonkyArrowHeadProgram,
]);

export default ChonkyArrowProgram;
