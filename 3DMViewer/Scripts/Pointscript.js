import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import Point from './Point.js';
import { TextBoard, TextStyle, LinearDimension } from './TextAndStyle.js';

let camera, renderer, scene, controls;

init();
let StPt = new Point(0, 0, 0);
let EdPt = new Point(0, 20, 0);
let DirPt = new Point(5, 8, 0);
animate();

function init() {
    THREE.Object3D.DefaultUp = new THREE.Vector3(0, 0, 1);

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    document.body.appendChild(renderer.domElement);

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0.8, 0.8, 0.8);

    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.set(0, 0, 50);

    let light = new THREE.DirectionalLight(0xffffff);
    light.intensity = 2;
    scene.add(light);

    const sphereGeo = new THREE.SphereGeometry(1, 20, 20);
    const sphere = new THREE.Mesh(sphereGeo, new THREE.MeshNormalMaterial)
    //scene.add(sphere)

    const axisHelper = new THREE.AxesHelper(2); // Specify the size of the axes
    scene.add(axisHelper);

    controls = new OrbitControls(camera, renderer.domElement);
    window.addEventListener('resize', onWindowResize, false);
}
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth / window.innerHeight);
}

let TestStyle = new TextStyle();
TestStyle.parameters.fontsize = 60;
TestStyle.DisplayTextLocation = true;
TestStyle.HoldPointColour = "#FF8282";
TestStyle.HoldPointSize = 1;
TestStyle.DistanceFromPoint = 0.5;
TestStyle.DistanceOfOffset = 0.5;

let TestDim = new LinearDimension(StPt, EdPt, DirPt, TestStyle);
TestDim.Print(scene, "X = <>", 1);
