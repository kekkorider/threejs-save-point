import { AdditiveBlending, Color, DoubleSide, ShaderMaterial } from 'three'

import vertexShader from './vertex.glsl'
import fragmentShader from './fragment.glsl'

export const BaseMaterial = new ShaderMaterial({
  vertexShader,
  fragmentShader,
  transparent: true,
  side: DoubleSide,
  blending: AdditiveBlending,
  uniforms: {
    u_Time: { value: 0 },
    u_Color: { value: new Color(0, 144 / 255, 1) }
  }
})
