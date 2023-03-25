import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';
import gsap from 'gsap';
import * as dat from 'dat.gui';
import Img from '../assets/images/textures/texture0.jpg';
import Alpha from '../assets/images/textures/texture0-alpha.png';
import AOImg from '../assets/images/textures/texture0-ao.png';
import DisplacementImg from '../assets/images/textures/texture0-displacement.png';
import HDRImg from '../assets/images/textures/glass.hdr';
// 1.创建场景
const scene = new THREE.Scene();
// 2.创建相机
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/ window.innerHeight, 0.1, 1000);

camera.position.set(0, 30, 30);
scene.add(camera);

// 3.场景中添加Object3D物理, 创建几何体对象

// 灯光和阴影 流程
// 1.材质要满足对光照有反应
// 2.设置渲染器开启阴影的计算 renderer.shadowMap.enable = true;
// 3.设置光照投射阴影 directionalLight.castShadow = true;
// 4.设置物体投射阴影 sphere.castShadow = true;
// 5.设置物体接受阴影 plane.receiveShadow = true;


// 加载HDR贴图作为环境纹理
const sphereGeometry = new THREE.SphereGeometry(1, 20, 20);
// PBR材质一种基于物理的标准材质, 这种材质与传统材质的不同之处在于, 不使用近似值来表示光与表面的相互作用， 而是使用物理上正确的模型(比如金属度，粗糙度,折射率等物理参数)
// 不是在特定光照下调整材质使其看起来很好，而是可以创造一种材质，能够正确的应对所有光照场景;
const standardMaterial = new THREE.MeshStandardMaterial({
    
});
const sphere = new THREE.Mesh(sphereGeometry, standardMaterial);
sphere.castShadow = true;
scene.add(sphere);

const plane = new THREE.Mesh(new THREE.PlaneGeometry(100, 100), standardMaterial);
plane.receiveShadow = true;
plane.position.set(0, -1, 0);
plane.rotation.x = -Math.PI / 2;
scene.add(plane);

// const plane2 = new THREE.Mesh(new THREE.PlaneGeometry(100, 100), standardMaterial);
// plane2.receiveShadow = true;
// plane2.position.set(0, 20, 0);
// plane2.rotation.x = Math.PI / 2;
// scene.add(plane2);

// 添加光源
// 添加环境光
const light = new THREE.AmbientLight(0xffffff, 0.2);
scene.add(light);
// 添加点光源 
const pointLight = new THREE.PointLight(0x0000ff, 1);
pointLight.castShadow = true;
pointLight.shadow.mapSize.set(1024, 1024);
// pointLight.target = sphere;
pointLight.distance = 0;
pointLight.position.set(10, 10, 10);
const pointLightHelper = new THREE.PointLightHelper(pointLight);
const cameraHelper = new THREE.CameraHelper(pointLight.shadow.camera);

// 添加点光源阴影相机
scene.add(cameraHelper);
scene.add(pointLightHelper);    
scene.add(pointLight);
console.log(pointLight);
// 4. 初始化一个渲染器
const renderer = new THREE.WebGLRenderer();
renderer.shadowMap.enabled = true;
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

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
    // console.log(time);
    pointLight.position.x = Math.sin(time) * 3 ;
    pointLight.position.z = Math.cos(time) * 3;
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

let targetFolder = gui.addFolder('目标');
targetFolder.add(sphere.position, 'x').min(-10).max(10).name('X轴').onChange(()=>pointLightHelper.update());
targetFolder.open();
gui.add( pointLight, 'castShadow', true).name('开启阴影');
gui.add(pointLight, 'distance').min(0).max(100).name('光照范围');
let cameraFolder = gui.addFolder('阴影相机');
cameraFolder.add(pointLight.shadow.mapSize, 'x').min(0).max(1024).name('阴影大小x').onChange(()=>pointLightHelper.update());
cameraFolder.add(pointLight.shadow.mapSize, 'y').min(0).max(1024).name('阴影大小y').onChange(()=>pointLightHelper.update());

cameraFolder.add(pointLight.shadow.camera, 'near').min(0).max(20).name('近裁剪面').onChange(()=>{
    pointLight.shadow.camera.updateProjectionMatrix();

    // Updates the helper based on the projectionMatrix of the camera.
    // 根据摄像机的透投影矩阵更新辅助对象, 所以更新辅助对象前先更新摄像机的投影矩阵
    cameraHelper.update();
});
cameraFolder.add(pointLight.shadow.camera, 'far').min(0).max(1000).step(1).name('远裁剪面').onChange(()=>{
    pointLight.shadow.camera.updateProjectionMatrix();
    cameraHelper.update();
});
cameraFolder.open();