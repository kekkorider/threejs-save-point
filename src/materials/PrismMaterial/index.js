import { ShaderMaterial, Color } from 'three'

import vertexShader from './vertex.glsl'
import fragmentShader from './fragment.glsl'

export const PrismMaterial = new ShaderMaterial({
  vertexShader,
  fragmentShader,
  transparent: false,
  uniforms: {
    u_Color: { value: new Color(0x458dc1) },
    u_FresnelFalloff: { value: 3.3 },
    u_FresnelStrength: { value: 0.8 }
  }
})
