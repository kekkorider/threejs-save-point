import {
  Scene,
  WebGLRenderer,
  PerspectiveCamera,
  Clock,
  Vector2,
  Vector3
} from 'three'

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

import { BaseMaterial } from './materials/BaseMaterial'
import { PrismMaterial } from './materials/PrismMaterial'
import { gltfLoader } from './loaders'

class App {
  #resizeCallback = () => this.#onResize()

  constructor(container, opts = { physics: false, debug: false }) {
    this.container = document.querySelector(container)
    this.screen = new Vector2(this.container.clientWidth, this.container.clientHeight)

    this.hasPhysics = opts.physics
    this.hasDebug = opts.debug
  }

  async init() {
    this.#createScene()
    this.#createCamera()
    this.#createRenderer()

    if (this.hasPhysics) {
      const { Simulation } = await import('./physics/Simulation')
      this.simulation = new Simulation(this)

      const { PhysicsBox } = await import('./physics/Box')
      const { PhysicsFloor } = await import('./physics/Floor')

      Object.assign(this, { PhysicsBox, PhysicsFloor })
    }

    this.#createClock()
    this.#addListeners()
    this.#createControls()

    await this.#loadModel()

    if (this.hasDebug) {
      const { Debug } = await import('./Debug.js')
      new Debug(this)

      const { default: Stats } = await import('stats.js')
      this.stats = new Stats()
      document.body.appendChild(this.stats.dom)
    }

    this.renderer.setAnimationLoop(() => {
      this.stats?.begin()

      this.#update()
      this.#render()

      this.stats?.end()
    })

    console.log(this)
  }

  destroy() {
    this.renderer.dispose()
    this.#removeListeners()
  }

  #update() {
    const elapsed = this.clock.getElapsedTime()

    this.savePoint.material.uniforms.u_Time.value = elapsed * 0.45
    this.savePoint.children[0].rotation.y = elapsed * 0.45

    this.simulation?.update()
  }

  #render() {
    this.renderer.render(this.scene, this.camera)
  }

  #createScene() {
    this.scene = new Scene()
  }

  #createCamera() {
    this.camera = new PerspectiveCamera(75, this.screen.x / this.screen.y, 0.1, 100)
    this.camera.position.set(0, 3, 5)
  }

  #createRenderer() {
    this.renderer = new WebGLRenderer({
      alpha: true,
      antialias: window.devicePixelRatio === 1
    })

    this.container.appendChild(this.renderer.domElement)

    this.renderer.setSize(this.screen.x, this.screen.y)
    this.renderer.setPixelRatio(Math.min(1.5, window.devicePixelRatio))
    this.renderer.setClearColor(0x121212)
    this.renderer.physicallyCorrectLights = false
  }

  /**
   * Load a 3D model and append it to the scene
   */
  async #loadModel() {
    const gltf = await gltfLoader.load('/save-point.glb')

    this.savePoint = gltf.scene.children[0]

    this.savePoint.material = BaseMaterial
    this.savePoint.children[0].material = PrismMaterial

    this.scene.add(this.savePoint)
  }

  #createControls() {
    this.controls = new OrbitControls(this.camera, this.renderer.domElement)
    this.controls.target = new Vector3(0, 2, 0)
    this.controls.update()
  }

  #createClock() {
    this.clock = new Clock()
  }

  #addListeners() {
    window.addEventListener('resize', this.#resizeCallback, { passive: true })
  }

  #removeListeners() {
    window.removeEventListener('resize', this.#resizeCallback, { passive: true })
  }

  #onResize() {
    this.screen.set(this.container.clientWidth, this.container.clientHeight)

    this.camera.aspect = this.screen.x / this.screen.y
    this.camera.updateProjectionMatrix()

    this.renderer.setSize(this.screen.x, this.screen.y)
  }
}

window._APP_ = new App('#app', {
  physics: false,
  debug: window.location.hash.includes('debug')
})

window._APP_.init()
