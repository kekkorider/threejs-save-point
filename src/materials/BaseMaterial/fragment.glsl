varying vec2 vUv;
varying float vAnimProgress;

uniform vec3 u_Color;
uniform float u_Opacity;

void main() {
  vec3 color = u_Color*smoothstep(1.0, 0.0, vUv.y);

  float opacity = u_Opacity;
  opacity *= smoothstep(0.0, 0.45, vAnimProgress);
  opacity *= smoothstep(1.0, 0.6, vAnimProgress);

  gl_FragColor = vec4(color, 1.0)*opacity;
}
