import { Pane } from 'tweakpane'
import { Color } from 'three'

export class Debug {
  constructor(app) {
    this.app = app

    this.#createPanel()
    this.#createSceneConfig()
    this.#createPhysicsConfig()
    this.#createBaseConfig()
    this.#createPrismConfig()
    this.#createTopConfig()
    this.#createParticlesConfig()
    this.#createPostprocessConfig()
  }

  refresh() {
    this.pane.refresh()
  }

  #createPanel() {
    this.pane = new Pane({
      container: document.querySelector('#debug')
    })
  }

  #createSceneConfig() {
    const folder = this.pane.addFolder({ title: 'Scene' })

    const params = {
      background: { r: 18, g: 18, b: 18 }
    }

    folder.addInput(params, 'background', { label: 'Background Color' }).on('change', e => {
      this.app.renderer.setClearColor(new Color(e.value.r / 255, e.value.g / 255, e.value.b / 255))
    })
  }

  #createPhysicsConfig() {
    if (!this.app.hasPhysics) return

    const folder = this.pane.addFolder({ title: 'Physics' })

    folder.addButton({ title: 'Toggle Debug' }).on('click', () => {
      window.dispatchEvent(new CustomEvent('togglePhysicsDebug'))
    })
  }

  #createBaseConfig() {
    const folder = this.pane.addFolder({ title: 'Base' })
    const mesh = this.app.scene.getObjectByName('Base')

    this.#createColorUniformControl(mesh, folder, 'u_Color')
    folder.addInput(mesh.material.uniforms.u_Opacity, 'value', { label: 'Opacity', min: 0, max: 1 })
  }

  #createPrismConfig() {
    const folder = this.pane.addFolder({ title: 'Prism' })
    const mesh = this.app.scene.getObjectByName('Prism')

    this.#createColorUniformControl(mesh, folder, 'u_Color')

    folder.addSeparator()
    folder.addInput(mesh.material.uniforms.u_FresnelFalloff, 'value', { label: 'Fresnel Falloff', min: 0, max: 5 })
    folder.addInput(mesh.material.uniforms.u_FresnelStrength, 'value', { label: 'Fresnel Strength', min: 0, max: 2 })
  }

  #createTopConfig() {
    const folder = this.pane.addFolder({ title: 'Top' })
    const mesh = this.app.scene.getObjectByName('Top')

    folder.addInput(mesh.material.uniforms.u_LightFalloff, 'value', { label: 'Light Falloff', min: 0, max: 15 })
    folder.addInput(mesh.material.uniforms.u_LightStrength, 'value', { label: 'Light Strength', min: 0, max: 2 })
  }

  #createParticlesConfig() {
    const folder = this.pane.addFolder({ title: 'Particles' })
    const mesh = this.app.scene.getObjectByName('Particles')

    this.#createColorUniformControl(mesh, folder, 'u_ColorA' , 'Color A')
    this.#createColorUniformControl(mesh, folder, 'u_ColorB' , 'Color B')
  }

  #createPostprocessConfig() {
    const folder = this.pane.addFolder({ title: 'Postprocess' })
    const { bloomPass, vignettePass } = this.app.passes

    folder.addInput(bloomPass.effects[0], 'intensity', { label: 'Bloom Intensity', min: 0, max: 5 })
    folder.addInput(bloomPass.effects[0].luminanceMaterial, 'threshold', { label: 'Bloom threshold', min: 0, max: 1 })
    folder.addInput(bloomPass.effects[0].luminanceMaterial, 'smoothing', { label: 'Bloom smoothing', min: 0, max: 1 })
    // folder.addInput(bloomPass, 'radius', { label: 'Bloom Radius', min: 0, max: 1 })
    // folder.addInput(bloomPass, 'threshold', { label: 'Bloom Threshold', min: 0, max: 1 })
    // folder.addInput(vignettePass, 'offset', { label: 'Vignette Offset', min: 0, max: 1 })
    // folder.addInput(vignettePass, 'darkness', { label: 'Vignette Darkness', min: 0, max: 1 })
  }

  /**
   * Adds a color control for the given object to the given folder.
   *
   * @param {*} obj Any THREE object with a color property
   * @param {*} folder The folder to add the control to
   */
  #createColorControl(obj, folder) {
    const baseColor255 = obj.color.clone().multiplyScalar(255)
    const params = { color: { r: baseColor255.r, g: baseColor255.g, b: baseColor255.b } }

    folder.addInput(params, 'color', { label: 'Color' }).on('change', e => {
      obj.color.setRGB(e.value.r, e.value.g, e.value.b).multiplyScalar(1 / 255)
    })
  }

  /**
   * Adds a color control for a custom uniform to the given object in the given folder.
   *
   * @param {THREE.Mesh} obj A `THREE.Mesh` object
   * @param {*} folder The folder to add the control to
   * @param {String} uniformName The name of the uniform to control
   * @param {String} label The label to use for the control
   */
   #createColorUniformControl(obj, folder, uniformName, label = 'Color') {
    const baseColor255 = obj.material.uniforms[uniformName].value.clone().multiplyScalar(255)
    const { r, g, b } = baseColor255
    const params = { color: { r, g, b } }

    folder.addInput(params, 'color', { label, view: 'color' }).on('change', ({ value }) => {
      obj.material.uniforms[uniformName].value.setRGB(value.r, value.g, value.b).multiplyScalar(1 / 255)
    })
  }
}
