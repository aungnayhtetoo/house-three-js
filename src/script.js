import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'

/**
 * Base
 */



// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')


// Scene
const scene = new THREE.Scene()

// Fog
const fog = new THREE.Fog('#262833', 1, 15)
scene.fog = fog



/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const doorColorTexture = textureLoader.load('/textures/door/color.jpg')
const doorAlphaTexture = textureLoader.load('/textures/door/alpha.jpg')
const doorAmbientOcclusionTexture = textureLoader.load('/textures/door/ambientOcclusion.jpg')
const doorHeightTexture = textureLoader.load('/textures/door/height.jpg')
const doorNormalTexture = textureLoader.load('/textures/door/normal.jpg')
const doorMetalnessTexture = textureLoader.load('/textures/door/metalness.jpg')
const doorRoughnessTexture = textureLoader.load('/textures/door/roughness.jpg')

const bricksColorTexture = textureLoader.load('/textures/bricks/color.jpg')
const bricksAmbientOcclusionTexture = textureLoader.load('/textures/bricks/ambientOcclusion.jpg')
const bricksNormalTexture = textureLoader.load('/textures/bricks/normal.jpg')
const bricksRoughnessTexture = textureLoader.load('/textures/bricks/roughness.jpg')

const grassColorTexture = textureLoader.load('/textures/grass/color.jpg')
const grassAmbientOcclusionTexture = textureLoader.load('/textures/grass/ambientOcclusion.jpg')
const grassNormalTexture = textureLoader.load('/textures/grass/normal.jpg')
const grassRoughnessTexture = textureLoader.load('/textures/grass/roughness.jpg')

grassColorTexture.repeat.set(8, 8)
grassAmbientOcclusionTexture.repeat.set(8, 8)
grassNormalTexture.repeat.set(8, 8)
grassRoughnessTexture.repeat.set(8, 8)

grassColorTexture.wrapS = THREE.RepeatWrapping
grassAmbientOcclusionTexture.wrapS = THREE.RepeatWrapping
grassNormalTexture.wrapS = THREE.RepeatWrapping
grassRoughnessTexture.wrapS = THREE.RepeatWrapping

grassColorTexture.wrapT = THREE.RepeatWrapping
grassAmbientOcclusionTexture.wrapT = THREE.RepeatWrapping
grassNormalTexture.wrapT = THREE.RepeatWrapping
grassRoughnessTexture.wrapT = THREE.RepeatWrapping

/**
 * House
 */
const house = new THREE.Group()
scene.add(house)

// Walls
const walls = new THREE.Mesh(
    new THREE.BoxBufferGeometry(4,3,4),
    new THREE.MeshStandardMaterial({
       map: bricksColorTexture,
       aoMap: bricksAmbientOcclusionTexture,
       normalMap: bricksNormalTexture,
       roughnessMap: bricksRoughnessTexture
    })
)

walls.geometry.setAttribute('uv2', 
    new THREE.Float32BufferAttribute(
        walls.geometry.attributes.uv.array, 2
    )
)

walls.position.y = 3 / 2
house.add(walls)

// Roof
const roof = new THREE.Mesh(
    new THREE.ConeBufferGeometry(3.3, 1.25, 4),
    new THREE.MeshStandardMaterial({
        color: '#b35f45'
    })
)
// height of the roof
roof.position.y = 3 + 1.25 / 2
roof.rotation.y = Math.PI * 0.25
house.add(roof)

// Door
const door = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(2, 2.4, 100, 100),
    new THREE.MeshStandardMaterial({
        map: doorColorTexture,
        transparent: true,
        alphaMap: doorAlphaTexture,
        aoMap: doorAmbientOcclusionTexture,
        displacementMap: doorHeightTexture,
        displacementScale: 0.1,
        normalMap: doorNormalTexture,
        metalnessMap: doorMetalnessTexture,
        roughnessMap: doorRoughnessTexture,
    })
)

door.geometry.setAttribute('uv2', 
    new THREE.Float32BufferAttribute(
        door.geometry.attributes.uv.array, 2
    )
)

door.position.y = 2.2 / 2
door.position.z = 4 / 2 + 0.01
house.add(door)

// Bushes
const bushGeometry = new THREE.SphereBufferGeometry(1,16,16)
const bushMaterial = new THREE.MeshStandardMaterial({ color: '#89c854' })

const bush1 = new THREE.Mesh(bushGeometry, bushMaterial)
bush1.scale.set(0.6,0.6,0.6)
bush1.position.set(0.8,0.2,2.5)

const bush2 = new THREE.Mesh(bushGeometry, bushMaterial)
bush2.scale.set(0.4,0.4,0.4)
bush2.position.set(1.5,0.2,2.4)

const bush3 = new THREE.Mesh(bushGeometry, bushMaterial)
bush3.scale.set(0.5,0.5,0.5)
bush3.position.set(-1.2,0.1,2.2)

const bush4 = new THREE.Mesh(bushGeometry, bushMaterial)
bush4.scale.set(0.2,0.2,0.2)
bush4.position.set(-1.3,0.1,2.7)

house.add(bush1, bush2, bush3, bush4)

// Tomb
const graves = new THREE.Group()
scene.add(graves)

const graveGeometry = new THREE.BoxBufferGeometry(0.6, 0.8, 0.2)
const graveMaterial = new THREE.MeshStandardMaterial(
    { 
        color: '#b2b6b1',
        // alphaMap: graveTexture,
        // transparent: true
    })

for(let i = 0; i < 50; i++){
    // Angle for full circle
    const angle = Math.random() * Math.PI * 2
    const radius = 4 + Math.random() * 6
    const x = Math.sin(angle) * radius
    const z = Math.cos(angle) * radius

    const grave = new THREE.Mesh(graveGeometry, graveMaterial)
    grave.position.set(x,0.3,z)
    grave.rotation.y = (Math.random() - 0.5) * 0.5
    grave.rotation.x = (Math.random() - 0.5) * 0.5
    grave.castShadow = true
    graves.add(grave)
}



// Floor
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 20),
    new THREE.MeshStandardMaterial({ 
        map: grassColorTexture,
        aoMap: grassAmbientOcclusionTexture,
        normalMap: grassNormalTexture,
        roughnessMap: grassRoughnessTexture,
    })
)

floor.geometry.setAttribute('uv2', 
    new THREE.Float32BufferAttribute(
        floor.geometry.attributes.uv.array, 2
    )
)


floor.rotation.x = - Math.PI * 0.5
floor.position.y = 0
scene.add(floor)



/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight('#b9d5ff', 0.12)
gui.add(ambientLight, 'intensity').min(0).max(1).step(0.001)
scene.add(ambientLight)

// Directional light
const moonLight = new THREE.DirectionalLight('#b9d5ff', 0.12)
moonLight.position.set(4, 5, - 2)
gui.add(moonLight, 'intensity').min(0).max(1).step(0.001)
gui.add(moonLight.position, 'x').min(- 5).max(5).step(0.001)
gui.add(moonLight.position, 'y').min(- 5).max(5).step(0.001)
gui.add(moonLight.position, 'z').min(- 5).max(5).step(0.001)
scene.add(moonLight)


// Door light
const doorLight = new THREE.PointLight('#ff7d46', 1, 7)
doorLight.position.set(0, 2.5, 2.5)
house.add(doorLight)

// Ghost Light
const ghostLight1 = new THREE.PointLight('#ff1156', 2, 3)
const ghostLight2 = new THREE.PointLight('#1290ff', 2, 3)
const ghostLight3 = new THREE.PointLight('#fff390', 2, 3)

scene.add(ghostLight1, ghostLight2, ghostLight3)

/**
 * Shadows
 */
moonLight.castShadow = true
doorLight.castShadow = true
ghostLight1.castShadow = true
ghostLight2.castShadow = true
ghostLight3.castShadow = true

walls.castShadow = true
bush1.castShadow = true
bush2.castShadow = true
bush3.castShadow = true

floor.receiveShadow = true

doorLight.shadow.mapSize.width = 256
doorLight.shadow.mapSize.height = 256
doorLight.shadow.camera.near = 1
doorLight.shadow.camera.far = 4

ghostLight1.shadow.mapSize.width = 256
ghostLight1.shadow.mapSize.height = 256
ghostLight1.shadow.camera.far = 7

ghostLight2.shadow.mapSize.width = 256
ghostLight2.shadow.mapSize.height = 256
ghostLight2.shadow.camera.far = 7

ghostLight3.shadow.mapSize.width = 256
ghostLight3.shadow.mapSize.height = 256
ghostLight3.shadow.camera.far = 7



// scene.add(new THREE.CameraHelper(doorLight.shadow.camera))

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 4
camera.position.y = 2
camera.position.z = 5
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.setClearColor('#262833')

renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update ghost
    const ghost1Angle = elapsedTime * 0.5
    ghostLight1.position.x = Math.sin(ghost1Angle)  * 5
    ghostLight1.position.z = Math.cos(ghost1Angle)  * 5
    ghostLight1.position.y = Math.sin(elapsedTime * 3)

    const ghost2Angle = elapsedTime * 0.25
    ghostLight2.position.z = Math.cos(ghost2Angle)  * 4
    ghostLight2.position.x = Math.sin(ghost2Angle)  * 4
    ghostLight2.position.y = Math.sin(elapsedTime * 4) * Math.sin(elapsedTime * 3)

    const ghost3Angle = elapsedTime * 0.18
    ghostLight3.position.z = Math.sin(ghost3Angle) * (7 + Math.sin(elapsedTime * 0.5))
    ghostLight3.position.x = Math.cos(ghost3Angle) * (7 + Math.sin(elapsedTime * 0.32))
    ghostLight3.position.y = Math.sin(elapsedTime * 4) + Math.sin(elapsedTime * 2.5)

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()