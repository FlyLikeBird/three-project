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
import model from '../../models/3.3.glb';
// 1.创建场景
const scene = new THREE.Scene();
// 2.创建相机
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/ window.innerHeight, 0.1, 2000);

camera.position.set(100, 100, 100);
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
const hdrLoader = new RGBELoader();
hdrLoader.load(HDRImg, (texture)=>{
    // scene.environment = texture;
    // scene.background = texture;
})
// 创建PBR材质，观察PBR材质内置参数的影响作用
const boxGeometry = new THREE.BoxGeometry(50, 50, 50);
const cylinderGeometry = new THREE.CylinderGeometry(50, 50, 100, 50, 10);
const sphereGeometry = new THREE.SphereGeometry(800, 100, 100);

const mtl = new THREE.MeshPhysicalMaterial({
    color:0x00ffff,
    // roughness:0,
    // metalness:1,
    // reflectivity:0.5
});
const mesh = new THREE.Mesh(boxGeometry, mtl);
scene.add(mesh);
// 加载一个gltf模型
// const gltfLoader = new GLTFLoader();
// gltfLoader.load(model, (obj)=>{
//     console.log(obj);
//     scene.add(obj.scene);
// })
// 添加光源
// 添加环境光
const light = new THREE.AmbientLight(0xffffff, 0.2);
scene.add(light);
const spotLight = new THREE.SpotLight(0xffffff, 1);
spotLight.position.set(100, 100, 100);
scene.add(spotLight);
console.log(scene);
// 4. 初始化一个渲染器
const renderer = new THREE.WebGLRenderer();
// renderer.shadowMap.enabled = true;
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
    
    mesh.rotation.y += 0.01;
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
// 设置pbr材质属性
let folder = gui.addFolder('pbr材质');
function handleColorChange( color, converSRGBToLinear = false ) {

    return function ( value ) {

        if ( typeof value === 'string' ) {

            value = value.replace( '#', '0x' );

        }

        color.setHex( value );

        if ( converSRGBToLinear === true ) color.convertSRGBToLinear();

    };

}
console.log(mtl.color.getHex());
folder.addColor({ color:mtl.color.getHex() },'color').onChange(value=>handleColorChange(value, true));
folder.add(mtl, 'roughness').min(0).max(1).step(0.1).name('粗糙度');
folder.add(mtl, 'metalness').min(0).max(1).step(0.1).name('金属度');
folder.add(mtl, 'reflectivity').min(0).max(1).step(0.1).name('反射率');
folder.open();


