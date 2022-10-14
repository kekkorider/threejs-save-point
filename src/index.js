import {
  Scene,
  WebGLRenderer,
  PerspectiveCamera,
  Clock,
  Vector2,
  Vector3,
  Matrix4,
  Points,
  BufferGeometry,
  BufferAttribute
} from 'three'

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

import { InstancedUniformsMesh } from 'three-instanced-uniforms-mesh'
import { BloomEffect, EffectComposer, EffectPass, RenderPass } from  'postprocessing'

import { BaseMaterial } from './materials/BaseMaterial'
import { PrismMaterial } from './materials/PrismMaterial'
import { TopMaterial } from './materials/TopMaterial'
import { ParticlesMaterial } from './materials/ParticlesMaterial'

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
    this.#createParticles()

    this.#createPostprocess()

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

    this.savePoint.material.uniforms.u_Time.value = elapsed
    this.savePoint.children[0].rotation.y = elapsed * 0.45
    this.savePoint.children[1].rotation.y = elapsed * 0.88

    this.particles.material.uniforms.u_Time.value = elapsed

    this.simulation?.update()
  }

  #render() {
    this.composer.render()
  }

  #createScene() {
    this.scene = new Scene()
  }

  #createCamera() {
    this.camera = new PerspectiveCamera(75, this.screen.x / this.screen.y, 0.1, 100)
    this.camera.position.set(0, 4, 5)
  }

  #createRenderer() {
    this.renderer = new WebGLRenderer({
      powerPreference: 'high-performance',
      alpha: true,
      antialias: false,
      stencil: false,
      depth: false
    })

    this.container.appendChild(this.renderer.domElement)

    this.renderer.setSize(this.screen.x, this.screen.y)
    this.renderer.setPixelRatio(Math.min(1.5, window.devicePixelRatio))
    this.renderer.setClearColor(0x121212)
    this.renderer.physicallyCorrectLights = false
  }

  #createPostprocess() {
    this.composer = new EffectComposer(this.renderer)

    this.passes = {}

    const renderPass = new RenderPass(this.scene, this.camera)
    this.composer.addPass(renderPass)
    Object.assign(this.passes, { renderPass })

    {
      const effect = new BloomEffect({ intensity: 3, luminanceThreshold: 0.7, luminanceSmoothing: 0.663 })
      const bloomPass = new EffectPass(this.camera, effect)
      this.composer.addPass(bloomPass)
      Object.assign(this.passes, { bloomPass })
    }
  }

  /**
   * Load a 3D model and append it to the scene
   */
  async #loadModel() {
    const gltf = await gltfLoader.load('/save-point.glb')
    const mat4 = new Matrix4()

    // Base
    this.savePoint = new InstancedUniformsMesh(gltf.scene.children[0].geometry, BaseMaterial, BaseMaterial.defines.NUM_INSTANCES)
    this.savePoint.name = 'Base'

    for (let i = 0; i < this.savePoint.count; i++) {
      this.savePoint.setMatrixAt(i, mat4.identity())
      this.savePoint.setUniformAt('u_Index', i, i)
    }

    // Prism
    const prism = gltf.scene.getObjectByName('Prism')
    prism.material = PrismMaterial

    // Top
    const top = gltf.scene.getObjectByName('Top')
    top.material = TopMaterial

    // Set children
    this.savePoint.add(prism, top)

    // Add to scene
    this.scene.add(this.savePoint)
  }

  #createParticles() {
    const geometry = new BufferGeometry()
    const count = 30

    // `position` attribute
    {
      const array = new Float32Array(count * 3)

      for (let i = 0; i < count; i++) {
        const a = Math.random() * Math.PI * 2

        array[i * 3 + 0] = Math.cos(a) * (0.5 + Math.random()*0.85)
        array[i * 3 + 1] = Math.random()
        array[i * 3 + 2] = Math.sin(a) * (0.5 + Math.random()*0.85)
      }

      geometry.setAttribute('position', new BufferAttribute(array, 3))
    }

    // `a_Random` attribute
    {
      const array = new Float32Array(count)

      for (let i = 0; i < count; i++) {
        array[i] = Math.random()
      }

      geometry.setAttribute('a_Random', new BufferAttribute(array, 1))
    }

    this.particles = new Points(geometry, ParticlesMaterial)
    this.particles.name = 'Particles'

    this.scene.add(this.particles)
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
