/*
 * This file taken from sigma.js.
 * See https://github.com/jacomyal/sigma.js/blob/e187ba5b567eb359f2b4e438987785da73684667/src/rendering/webgl/shaders/edge.arrowHead.frag.glsl
 */
precision mediump float;

varying vec4 v_color;

void main(void) {
  gl_FragColor = v_color;
}
