import { ShaderMaterial, Color } from 'three'

import vertexShader from './vertex.glsl'
import fragmentShader from './fragment.glsl'

export const TopMaterial = new ShaderMaterial({
  vertexShader,
  fragmentShader,
  transparent: false,
  vertexColors: true,
  uniforms: {
    u_FrontColor: { value: new Color(0xc450d4) },
    u_BackColor: { value: new Color(0x44fdff) },
    u_LightFalloff: { value: 9.78 },
    u_LightStrength: { value: 1.43 }
  }
})
