varying vec2 vUv;
varying vec3 vColor;
varying vec3 vNormal;
varying vec3 vPosition;

void main() {
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);

  vUv = uv;

  // The red channel will be used to determine the color
  vColor = color.rgb;
  vPosition = (modelMatrix * vec4(position, 0.0)).xyz;
  vNormal = (modelMatrix * vec4(normal, 0.0)).xyz;
}
