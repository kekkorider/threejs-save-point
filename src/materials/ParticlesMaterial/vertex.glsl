attribute float a_Random;

uniform float u_Time;

varying float vAnimProgress;
varying float vRandom;

void main() {
  vec3 pos = position;

  float animProgress = fract(0.3*u_Time + a_Random);

  pos.y += animProgress*1.4;

  vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);

  gl_Position = projectionMatrix * mvPosition;
  gl_PointSize = a_Random*(200.0 / -mvPosition.z);

  vAnimProgress = animProgress;
  vRandom = a_Random;
}
