varying vec2 vUv;
varying float vAnimProgress;

uniform vec3 u_Color;

void main() {
  vec3 color = u_Color * smoothstep(1.0, 0.0, vUv.y);
  color *= smoothstep(0.0, 0.2, vAnimProgress);
  color *= smoothstep(1.0, 0.7, vAnimProgress);

  gl_FragColor = vec4(color, 1.0);
}
