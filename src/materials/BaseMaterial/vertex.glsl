varying vec2 vUv;
varying float vAnimProgress;

uniform float u_Time;
uniform float u_Index;

#define PI 3.1415926535897932384626433832795

#include ../../glsl/rotate.glsl

void main() {
  #include <begin_vertex>

  // Distort to generate peaks
  transformed.y += cos(uv.x*PI*16.0) * step(0.5, uv.y) * 0.07;
  transformed.y += sin(uv.x*PI*188.0) * step(0.5, uv.y) * 0.074;
  transformed.y += cos(uv.x*PI*24.0) * step(0.5, uv.y) * 0.08;

  // Move peaks to give a "flamy" effect
  transformed.y -= cos(uv.x*PI*34.0 + u_Time*8.0) * step(0.5, uv.y) * 0.05;

  float instanceOffset = 1.0 / float(NUM_INSTANCES) * u_Index;
  float animProgress = fract(instanceOffset + u_Time*0.4);

  // Scale vertically over time
  transformed.y *= 2.8 - sin(animProgress)*2.7;

  // Scale horizontally over time
  transformed.xz *= 0.7 + animProgress*0.8;

  // Rotate over time
  transformed.xz *= rotate(u_Time*0.11);

  #include <project_vertex>

  vUv = uv;
  vAnimProgress = animProgress;
}
