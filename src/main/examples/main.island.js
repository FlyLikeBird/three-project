import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import * as dat from 'dat.gui';
import Img from '../../assets/images/textures/texture0.jpg';
import Alpha from '../../assets/images/textures/texture0-alpha.png';
import AOImg from '../../assets/images/textures/texture0-ao.png';
import DisplacementImg from '../../assets/images/textures/texture0-displacement.png';
import HDRImg from '../../assets/images/textures/glass.hdr';
import SkyImg from '../../assets/images/textures/sky.jpg';
import model from '../../models/3.2.glb';
// 1.创建场景
const scene = new THREE.Scene();
// 2.创建相机
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/ window.innerHeight, 0.1, 2000);

camera.position.set(-50, 50, 130);
scene.add(camera);

// 3.场景中添加Object3D物理, 创建几何体对象

const planeMaterial = new THREE.MeshBasicMaterial({
    color:0xffffff
})
const plane = new THREE.Mesh(new THREE.PlaneGeometry(100, 100), planeMaterial);
plane.receiveShadow = true;
plane.position.set(0, -1, 0);
plane.rotation.x = -Math.PI / 2;
// scene.add(plane);
// 创建一个表示天空环境的球体
const skyGeometry = new THREE.SphereGeometry(800, 100, 100);
const loader = new THREE.TextureLoader();
const texture = new THREE.MeshBasicMaterial({
    map:loader.load(SkyImg),
    side:THREE.DoubleSide
})
const skyMesh = new THREE.Mesh(skyGeometry, texture);
scene.add(skyMesh);
// 加载一个gltf模型
const gltfLoader = new GLTFLoader();
gltfLoader.load(model, (obj)=>{
    console.log(obj);
    scene.add(obj.scene);
})
// 添加光源
// 添加环境光
const light = new THREE.AmbientLight(0xffffff, 0.2);
// scene.add(light);

// 4. 初始化一个渲染器
const renderer = new THREE.WebGLRenderer();
renderer.shadowMap.enabled = true;
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
console.log(renderer);
// 5. 使用渲染器，通过相机讲场景渲染出来
renderer.render(scene, camera);
// 轨道控制器，通过自动注册交互事件控制摄像机的观测范围
const controls = new OrbitControls(camera, renderer.domElement);

const axesHepler = new THREE.AxesHelper(5);
scene.add(axesHepler);

// 动画考虑每一帧的时间差，保持匀速状态
const clock = new THREE.Clock();

function render(){
    let time = clock.getElapsedTime();
    
    // cube.position.x = time * 3;
    renderer.render(scene, camera);
    requestAnimationFrame(render);
}

render();

window.addEventListener('resize', ()=>{
    // 当屏幕变化时，更新摄像机的宽高比
    camera.aspect = window.innerWidth / window.innerHeight;
    // 更新摄像机的投影矩阵
    camera.updateProjectionMatrix();
    // 更新渲染器
    renderer.setSize(window.innerWidth, window.innerHeight);
    // 设置渲染器的像素比(物理像素点和实际显示像素点的比值， 实际显示像素点可通过设置分辨率调节)
    renderer.setPixelRatio(window.devicePixelRatio);
    
})

const gui = new dat.GUI();
// 设置聚光灯的属性
// let targetFolder = gui.addFolder('目标');
// targetFolder.add(sphere.position, 'x').min(-10).max(10).name('X轴').onChange(()=>spotLightHelper.update());
// targetFolder.open();
// gui.add( spotLight, 'castShadow', true).name('开启阴影');
// gui.add(spotLight, 'angle').min(0).max(Math.PI/2).onChange(()=>spotLightHelper.update());
// let cameraFolder = gui.addFolder('阴影相机');
// cameraFolder.add(spotLight.shadow, 'focus').min(0).max(1).name('focus');
// cameraFolder.add(spotLight.shadow.mapSize, 'x').min(0).max(1024).name('阴影大小x').onChange(()=>spotLightHelper.update());
// cameraFolder.add(spotLight.shadow.mapSize, 'y').min(0).max(1024).name('阴影大小y').onChange(()=>spotLightHelper.update());

// cameraFolder.add(spotLight.shadow.camera, 'near').min(0).max(10).name('近裁剪面').onChange(()=>{
//     spotLight.shadow.camera.updateProjectionMatrix();
//     // Updates the helper based on the projectionMatrix of the camera.
//     // 根据摄像机的透投影矩阵更新辅助对象, 所以更新辅助对象前先更新摄像机的投影矩阵
//     cameraHelper.update();
// });
// cameraFolder.add(spotLight.shadow.camera, 'far').min(0).max(1000).step(1).name('远裁剪面').onChange(()=>{
//     spotLight.shadow.camera.updateProjectionMatrix();
//     cameraHelper.update();
// });
// cameraFolder.open();