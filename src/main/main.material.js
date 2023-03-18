import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import gsap from 'gsap';
import * as dat from 'dat.gui';
import Img from '../assets/images/textures/texture0.jpg';
// 1.创建场景
const scene = new THREE.Scene();

// 2.创建相机
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/ window.innerHeight, 0.1, 1000);

console.log(camera);
camera.position.set(0, 0, 10);
scene.add(camera);

// 3.场景中添加Object3D物理, 创建几何体对象


// 导入纹理
const textureLoader = new THREE.TextureLoader();
const texture = textureLoader.load(Img);

console.log(texture);
const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
const cubeMaterial = new THREE.MeshBasicMaterial({
    // color:0xffff00,
    map:texture
});
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
scene.add(cube);


// 4. 初始化一个渲染器
const renderer = new THREE.WebGLRenderer();
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

// gsap库设置动画
// gsap.to(cube.position, { x:5, duration:5 })
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
    // 设置渲染器的像素比(物理像素点和显示像素点的比值， 显示像素点可通过设置分辨率调节)
    renderer.setPixelRatio(window.devicePixelRatio);
})

const gui = new dat.GUI();
gui.add(cube.position, 'x').min(0).max(10);
gui.addColor({ color:'#ffff00' }, 'color').onChange(value=>{
    cube.material.color.set(value);
});

