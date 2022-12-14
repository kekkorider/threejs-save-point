import { AdditiveBlending, ShaderMaterial, Color } from 'three'

import vertexShader from './vertex.glsl'
import fragmentShader from './fragment.glsl'

export const ParticlesMaterial = new ShaderMaterial({
  vertexShader,
  fragmentShader,
  transparent: true,
  depthWrite: false,
  blending: AdditiveBlending,
  uniforms: {
    u_Time: { value: 0 },
    u_ColorA: { value: new Color(82 / 255, 45 / 255, 226 / 255) },
    u_ColorB: { value: new Color(11 / 255, 103 / 255, 201 / 255) }
  }
})
