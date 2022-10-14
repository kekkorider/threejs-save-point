varying float vAnimProgress;
varying float vRandom;

uniform vec3 u_ColorA;
uniform vec3 u_ColorB;

void main() {
  vec2 uv = gl_PointCoord.xy;

  // Invert the Y axis to have the origin at the bottom left corner
  uv.y = 1.0 - uv.y;

  // remap the coordinates to the range [-1, 1]
  uv = uv*2.0 - 1.0;

  // squash the UVs on the X axis
  uv.x *= 7.0;

  float d = distance(uv, vec2(0.0));
  float c = 1.0 - smoothstep(0.45, 0.9, d);

  vec3 particleColor = mix(u_ColorA, u_ColorB, smoothstep(0.4, 0.6, vRandom));

  vec3 color = (particleColor+particleColor) * c;

  float opacity = smoothstep(0.0, 0.1, vAnimProgress);
  opacity *= smoothstep(1.0, 0.8, vAnimProgress);

  gl_FragColor = vec4(color, 1.0)*opacity;
}
