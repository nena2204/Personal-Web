import * as THREE from "three";
import { OrbitControls } from 'jsm/controls/OrbitControls.js';

const container = document.querySelector('.container');
const w = container.clientWidth;
const h = container.clientHeight;
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(w, h);
renderer.setClearColor(0x000000, 0);
container.appendChild(renderer.domElement);

renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.outputColorSpace = THREE.LinearSRGBColorSpace;

const earthGroup = new THREE.Group();
earthGroup.rotation.z = -23.4 * Math.PI / 180;
earthGroup.scale.set(1.7,1.7,1.7);
scene.add(earthGroup);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableZoom = false;
controls.minPolarAngle = Math.PI / 2;
controls.maxPolarAngle = Math.PI / 2;
controls.enablePan = false;

const detail = 12;
const loader = new THREE.TextureLoader();
const geometry = new THREE.IcosahedronGeometry(1, detail);
const material = new THREE.MeshPhongMaterial({
    map: loader.load("assets/zemja/00_earthmap1k.jpg"),
});

const earthMesh = new THREE.Mesh(geometry, material);
earthGroup.add(earthMesh);

const lightsMat = new THREE.MeshBasicMaterial({
    map: loader.load("assets/zemja/03_earthlights1k.jpg"),
    blending: THREE.AdditiveBlending,
});
const lightsMesh = new THREE.Mesh(geometry, lightsMat);
earthGroup.add(lightsMesh);

const cloudsMat = new THREE.MeshStandardMaterial({
    map: loader.load("assets/zemja/04_earthcloudmap.jpg"),
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending,
    alphaMap: loader.load('assets/zemja/05_earthcloudmaptrans.jpg'),
});

const cloudsMesh = new THREE.Mesh(geometry, cloudsMat);
cloudsMesh.scale.setScalar(1.003);
earthGroup.add(cloudsMesh);

const sunLight = new THREE.DirectionalLight(0xffffff, 2.0);
sunLight.position.set(-2, 0.5, 1.5);
scene.add(sunLight);

function animate() {
    requestAnimationFrame(animate);
    earthMesh.rotation.y += 0.002;
    lightsMesh.rotation.y += 0.002;
    cloudsMesh.rotation.y += 0.0023;
    renderer.render(scene, camera);
}

animate();

function handleWindowResize() {
    const w = container.clientWidth;
    const h = container.clientHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
}

window.addEventListener('resize', handleWindowResize, false);