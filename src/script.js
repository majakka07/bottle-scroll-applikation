import * as THREE from 'three'
import gsap from 'gsap'
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

gsap.registerPlugin(ScrollTrigger)

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas,
  alpha: true,
  antialias: true,
  powerPreference: "high-performance"
})
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))

// Camera
const camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 100)
camera.position.z = 6
scene.add(camera)

// Resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
})

// Lights
scene.add(new THREE.AmbientLight('#ffffff', 2))
const dirLight = new THREE.DirectionalLight('#ffffff', 3)
dirLight.position.set(1, 1, 0)
scene.add(dirLight)

// Particles
const particlesCount = 200
const positions = new Float32Array(particlesCount * 3)
for (let i = 0; i < particlesCount; i++) {
  positions[i*3+0] = (Math.random() - 0.5) * 10
  positions[i*3+1] = (Math.random() - 0.5) * 10
  positions[i*3+2] = (Math.random() - 0.5) * 10
}
const particlesGeometry = new THREE.BufferGeometry()
particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
const particles = new THREE.Points(
  particlesGeometry,
  new THREE.PointsMaterial({ size: 0.03 })
)
scene.add(particles)

// Loader
const gltfLoader = new GLTFLoader()
const meshes = []

function loadBottle(url, index, setup) {
  gltfLoader.load(url, (gltf) => {
    const model = gltf.scene
    scene.add(model)
    meshes[index] = model
    setup(model)
  })
}

// Bottles

// Denim Bottle
loadBottle('/models/BottleDenim.glb', 0, (gltf) => {
  gltf.position.set(2, -1.5, -1.5)
  gltf.rotation.x = 0.5

    // Denim Moves
    gsap.to(gltf.position, {
        x: -6, y: -2, z: -6,
        scrollTrigger: { trigger: '.section1', scrub: 1, start: 'top top', end: 'center top' }
    })
    // Denim Rotates
    gsap.to(gltf.rotation, {
        x: 0,
        scrollTrigger: { trigger: '.section1', scrub: 1, start: 'top top', end: 'center top' }
    })
})

loadBottle('/models/BottleFabric.glb', 1, (gltf) => {
  gltf.position.set(-7, -2, -8)
  gltf.scale.set(0,0,0)
    // Fabric Scales
    gsap.to(gltf.scale, {
        x:1,y:1,z:1,
        scrollTrigger:{ trigger:'.section2', scrub:1, start:'top bottom', end:'+=50' }
    })
    // Fabric Moves
    gsap.to(gltf.position, {
        x:-4.1,
        scrollTrigger:{ trigger:'.section2', scrub:1, start:'top center', end:'bottom bottom' }
    })
})

loadBottle('/models/BottleLeather.glb', 2, (gltf) => {
  gltf.position.set(-8, -2, -10)
  gltf.scale.set(0,0,0)

    // Leather Scales
    gsap.to(gltf.scale, {
        x:1,y:1,z:1,
        scrollTrigger:{ trigger:'.section2', scrub:1, start:'top bottom', end:'+=50' }
    })
    // Leather Moves
    gsap.to(gltf.position, {
        x:-2,
        scrollTrigger:{ trigger:'.section2', scrub:1, start:'75% bottom', end:'bottom bottom' }
    })
    // Leather Rotates
    gsap.to(gltf.rotation, {
        x:-1,
        scrollTrigger:{ trigger:'.section2', scrub:1, start:'bottom top', end:'+=300' }
    })
})

// Camera scroll
gsap.to(camera.position, {
  x:-2, y:-1.7, z:-7,
  scrollTrigger:{ trigger:'.section3', scrub:1, start:'top bottom', end:'+=300' }
})

// Animate
const clock = new THREE.Clock()
let prev = 0

function tick() {
  const t = clock.getElapsedTime()
  const dt = t - prev
  prev = t

  for (const mesh of meshes) {
    if (!mesh) continue
    mesh.rotation.y += dt * 0.1
  }

  renderer.render(scene, camera)
  requestAnimationFrame(tick)
}

// Start after DOM is ready
window.addEventListener('load', () => {
  ScrollTrigger.refresh()
  tick()
})
