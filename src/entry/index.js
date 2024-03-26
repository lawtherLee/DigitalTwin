import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { CSS2DRenderer } from "three/examples/jsm/renderers/CSS2DRenderer";
import { loadManager } from "@/model/loadManager.js";
import { City } from "@/model/City.js";
import { Ship } from "@/model/Ship.js";
import { Sky } from "@/environment/Sky.js";
import { EffectManager } from "@/utils/EffectManager.js";
import { ClickHandler } from "@/utils/ClickHandler.js";
import { Fly } from "@/model/Fly.js";
import { EventBus } from "@/utils/EventBus.js";
let scene, camera, renderer, control, css2Renderer;

// 初始化 3d 基本环境
function init() {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    10000,
  );
  camera.position.set(-148, 55, -101);

  // 创建渲染器
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);

  // 创建2D渲染器
  css2Renderer = new CSS2DRenderer();
  css2Renderer.setSize(window.innerWidth, window.innerHeight);
  css2Renderer.domElement.style.position = "absolute";
  css2Renderer.domElement.style.top = "0px";
  css2Renderer.domElement.style.pointerEvents = "none";

  // DOM 添加到页面
  const canvas = document.getElementById("canvas");
  canvas.appendChild(renderer.domElement);
  canvas.appendChild(css2Renderer.domElement);

  // 轨道控制器
  control = new OrbitControls(camera, renderer.domElement);
  control.update();

  // 坐标轴
  const axesHelper = new THREE.AxesHelper(1500);
  scene.add(axesHelper);
}

// 渲染循环
function renderLoop(t) {
  // 这里不再调用轨道控制器 update 方法，会影响摄像机 lookAt
  renderer.render(scene, camera);
  css2Renderer.render(scene, camera);
  // 遍历所有要做动效的实例物体内置的onTick方法
  EffectManager.getInstance().tickForEach(t);
  requestAnimationFrame(renderLoop);
}

// 灯光
function createLight() {
  // 基础光-环境光
  const ambientLight = new THREE.AmbientLight("#fff", 3);
  scene.add(ambientLight);
}

// 适配
window.addEventListener("resize", function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  css2Renderer.setSize(window.innerWidth, window.innerHeight);
});

// 启动
window.addEventListener("DOMContentLoaded", function () {
  init();
  createLight();

  // 注册光线投射
  ClickHandler.getInstance().init(camera);

  // 初始化天空
  new Sky(scene).setBack("textures/sky/", [
    "px.jpg",
    "nx.jpg",
    "py.jpg",
    "ny.jpg",
    "pz.jpg",
    "nz.jpg",
  ]);

  loadManager(["fbx/city.fbx", "gltf/ship.glb"], (modelList) => {
    modelList.forEach((model) => {
      if (model.url === "fbx/city.fbx") {
        new City(model.model, scene, camera, control);
      } else if (model.url === "gltf/ship.glb") {
        const ship = new Ship(model.model, scene, camera, control);
        ship.model.position.set(150, 0, -80);
        ship.model.rotation.set(0, -Math.PI / 2, 0);
        ship.model.scale.set(100, 100, 100);
        EffectManager.getInstance().addObj(ship);
        // 订阅改变摄像机跟随游船移动的事件
        EventBus.getInstance().on("mode-roaming", (isOpen) => {
          ship.control.enabled = !isOpen; // 关闭/开启轨道控制器
          ship.isMoveCamera = isOpen; // 摄像机跟随移动
        });
      }
    });

    // 生成飞行器对象
    const meshObj = new THREE.Mesh(
      new THREE.BoxGeometry(5, 5, 5),
      new THREE.MeshBasicMaterial({ color: "lightblue" }),
    );
    const fly = new Fly(meshObj, scene, camera, control);
    // 注册动效
    EffectManager.getInstance().addObj(fly);
    // 注册事件 - 控制摄像机是否移动鸟瞰
    EventBus.getInstance().on("mode-topView", (isOpen) => {
      // 鸟瞰时禁用轨道控制器
      fly.control.enabled = !isOpen;
      fly.isCameraMove = isOpen;
    });
  });

  renderLoop();
});
