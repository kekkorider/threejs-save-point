varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;

uniform vec3 u_Color;
uniform float u_FresnelFalloff;
uniform float u_FresnelStrength;

void main() {
  vec3 color = u_Color;

  vec3 normal = normalize(vNormal);
  vec3 cameraDir = normalize(cameraPosition - vPosition);
  float d = dot(normal, cameraDir);

  // Fresnel
  float fresnel = 1.0 - max(0.0, d);
  fresnel = pow(fresnel, u_FresnelFalloff);

  color += fresnel*u_FresnelStrength;

  gl_FragColor = vec4(color, 1.0);
}
