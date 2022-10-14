varying vec2 vUv;
varying float vAnimProgress;

uniform float u_Time;

#define PI 3.1415926535897932384626433832795

#include ../../glsl/rotate.glsl

void main() {
  vec3 pos = position;

  // Distort
  pos.y += cos(uv.x*PI*16.0) * step(0.5, uv.y) * 0.07;
  pos.y += sin(uv.x*PI*188.0) * step(0.5, uv.y) * 0.074;
  pos.y += cos(uv.x*PI*24.0) * step(0.5, uv.y) * 0.08;

  // Move peaks to give a "flamy" effect
  pos.y -= cos(uv.x*PI*34.0 + u_Time*16.0) * step(0.5, uv.y) * 0.05;

  float animProgress = fract(u_Time*1.5);

  // Scale vertically over time
  pos.y *= 1.6 - animProgress*1.1;

  // Scale horizontally over time
  pos.xz *= 1.0 + animProgress*0.35;

  // Rotate over time
  pos.xz *= rotate(u_Time*0.24);

  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);

  vUv = uv;
  vAnimProgress = animProgress;
}
