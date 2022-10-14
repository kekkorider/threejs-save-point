varying vec2 vUv;
varying vec3 vColor;
varying vec3 vNormal;
varying vec3 vPosition;

uniform vec3 u_FrontColor;
uniform vec3 u_BackColor;
uniform float u_LightFalloff;
uniform float u_LightStrength;

void main() {
  vec3 color = mix(u_BackColor, u_FrontColor, vColor.r);

  vec3 cameraDir = normalize(cameraPosition - vPosition);
  vec3 normal = normalize(vNormal);
  float d = dot(cameraDir, normal);
  d = clamp(d, 0.0, 0.9);
  d = pow(d, u_LightFalloff);
  d *= u_LightStrength;

  color += d;

  gl_FragColor = vec4(color, 1.0);
}
