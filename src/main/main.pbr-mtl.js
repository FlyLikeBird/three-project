import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import gsap from 'gsap';
import * as dat from 'dat.gui';
import Img from '../assets/images/textures/texture0.jpg';
import Alpha from '../assets/images/textures/texture0-alpha.png';
import AOImg from '../assets/images/textures/texture0-ao.png';
import DisplacementImg from '../assets/images/textures/texture0-displacement.png';
// 1.创建场景
const scene = new THREE.Scene();

// 2.创建相机
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/ window.innerHeight, 0.1, 1000);

camera.position.set(0, 0, 5);
scene.add(camera);

// 3.场景中添加Object3D物理, 创建几何体对象
// 创建纹理加载器，导入纹理
const manager = new THREE.LoadingManager();
manager.onStart = ()=>{
    console.log('开始加载');
}
manager.onProgress = (url, num, total)=>{
    console.log(url);
    console.log('已加载纹理数:', num);
    console.log('总共加载纹理数:', total);
}
manager.onLoad = ()=>{
    console.log('所有纹理加载完成');
}
const textureLoader = new THREE.TextureLoader(manager);
const texture = textureLoader.load(Img);
const alphaTexture = textureLoader.load(Alpha);
const displacementTexture = textureLoader.load(DisplacementImg);
const cubeGeometry = new THREE.BoxGeometry(1, 1, 1, 20, 20, 20);
// PBR材质一种基于物理的标准材质, 这种材质与传统材质的不同之处在于, 不使用近似值来表示光与表面的相互作用， 而是使用物理上正确的模型(比如金属度，粗糙度,折射率等物理参数)
// 不是在特定光照下调整材质使其看起来很好，而是可以创造一种材质，能够正确的应对所有光照场景;
const cubeMaterial = new THREE.MeshStandardMaterial({
    // color:0xffff00,
    map:texture,
    // 透明贴图
    // alphaMap:alphaTexture,
    // transparent:true
    // 位移贴图, 将网格中的顶点映射为图像中每个像素的值（白色为最高)，  
    // displacementMap:displacementTexture,
    // displacementScale:0.5,
    // roughnessMap:alphaTexture,
    metalness:1
});
// 根据几何体已有的uv坐标设置第二组uv坐标
cubeGeometry.setAttribute('uv2', new THREE.BufferAttribute(cubeGeometry.attributes.uv.array, 2));
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
scene.add(cube);
console.log(cube);

// 添加光源
// 添加环境光
const light = new THREE.AmbientLight(0xffffff, 0.2);
scene.add(light);
// 添加平行光
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(10, 10, 10);
scene.add(directionalLight);
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
    // 设置渲染器的像素比(物理像素点和实际显示像素点的比值， 实际显示像素点可通过设置分辨率调节)
    renderer.setPixelRatio(window.devicePixelRatio);
})

const gui = new dat.GUI();
gui.add(cube.position, 'x').min(0).max(10);
gui.addColor({ color:'#ffff00' }, 'color').onChange(value=>{
    cube.material.color.set(value);
});

