import { AdditiveBlending, Color, DoubleSide, ShaderMaterial } from 'three'

import vertexShader from './vertex.glsl'
import fragmentShader from './fragment.glsl'

export const BaseMaterial = new ShaderMaterial({
  vertexShader,
  fragmentShader,
  transparent: true,
  side: DoubleSide,
  blending: AdditiveBlending,
  depthWrite: false,
  defines: {
    NUM_INSTANCES: 4
  },
  uniforms: {
    u_Time: { value: 0 },
    u_Color: { value: new Color(0, 144 / 255, 1) },
    u_Opacity: { value: 1 },
    u_Index: { value: 0 }
  }
})
