import { BaseModel } from "@/model/BaseModel.js";
import * as THREE from "three";
import { EventBus } from "@/utils/EventBus.js";

export class Ship extends BaseModel {
  init() {
    this.scene.add(this.model);
    this.pointIndex = 0; // 保存当前游船所在位置坐标的索引哎
    this.generatorMovePath();

    this.isMoveCamera = false;
    this.onModelAttach();
  }
  // 生成游船行进的路线坐标点集合
  generatorMovePath() {
    // 设置平滑的三维样条曲线路线坐标点，CatmullRomCurve3
    // 设置关键的几个点坐标，其他的构造函数内会帮我们计算
    const shipPath = new THREE.CatmullRomCurve3([
      new THREE.Vector3(
        134.356097129589,
        2.0112688541412354,
        -78.91746888546072,
      ),
      new THREE.Vector3(
        13.132075955743915,
        2.0112688541412425,
        -69.85260460470285,
      ),
      new THREE.Vector3(
        13.132075955743915,
        2.0112688541412425,
        -69.85260460470285,
      ),
      new THREE.Vector3(
        -80.28995611104816,
        2.0112688541412282,
        -12.640254617216172,
      ),
      new THREE.Vector3(
        -71.5470123066941,
        2.0112688541412354,
        25.641138454485144,
      ),
      new THREE.Vector3(
        -71.5470123066941,
        2.0112688541412354,
        25.641138454485144,
      ),
      new THREE.Vector3(
        -17.5179164111899,
        2.0112688541412354,
        139.95062075065943,
      ),
      new THREE.Vector3(
        -67.10547001341894,
        2.0112688541412354,
        64.30494908329582,
      ),
      new THREE.Vector3(
        -87.03568940230136,
        2.0112688541412354,
        20.40776369519459,
      ),
      new THREE.Vector3(
        -88.0509634357777,
        2.0112688541412425,
        -32.429601593890354,
      ),
      new THREE.Vector3(
        -70.27457116256328,
        2.0112688541412425,
        -50.370253013515836,
      ),
      new THREE.Vector3(
        -39.206573479212764,
        2.0112688541412425,
        -64.28841112963838,
      ),
      new THREE.Vector3(
        47.33347662423566,
        2.0112688541412354,
        -73.13885409538068,
      ),
      new THREE.Vector3(
        134.356097129589,
        2.0112688541412354,
        -78.91746888546072,
      ),
    ]);
    // getSpacedPoints 等间距的坐标点
    this.pointArr = shipPath.getSpacedPoints(5500);

    // 把坐标点 => 几何图形 => 线段物体显示一下（辅助我们理解）
    const geometry = new THREE.BufferGeometry().setFromPoints(this.pointArr); // 缓冲几何
    const material = new THREE.LineBasicMaterial({
      color: 0x00ff00,
      side: THREE.DoubleSide,
    });
    const line = new THREE.Line(geometry, material);
    // this.scene.add(line);
  }
  // 游船行进方法 - 切换坐标的位置
  onTick() {
    if (this.pointIndex < this.pointArr.length - 1) {
      const { x, y, z } = this.pointArr[this.pointIndex + 1];
      if (this.isMoveCamera) {
        if (!this.isMouseTouching) {
          // 鼠标没有被按下时，才设置摄像机的look at
          this.camera.lookAt(x, y + 20, z);
        }
        this.camera.position.set(x, y + 20, z);
      }
      // 游船移动
      // 取出坐标设置给模型对象
      this.model.position.copy(this.pointArr[this.pointIndex]);
      // 确保船头朝向下一个坐标点的位置
      this.model.lookAt(this.pointArr[this.pointIndex + 1]);
      this.pointIndex += 1;
    } else {
      // 索引归0 重新进入重新继续做坐标取值然后做动画效果
      this.pointIndex = 0;
    }
  }
  mousedownFn = () => {
    this.isMouseTouching = true;
  };
  mousemoveFn = (e) => {
    if (this.isMouseTouching) {
      // 旋转核心思想：在原有的旋转角度基础上，新增移动的偏移量， ×0.01让旋转弧度降低
      this.camera.rotateY((this.prePos - e.clientX) * 0.01);
    }
    this.prePos = e.clientX;
  };
  mouseupFn = () => {
    this.isMouseTouching = false;
    this.proPos = undefined; // 清空上一次记录的坐标点位置
  };
  // 绑定移除鼠标事件
  onModelAttach() {
    // 点击漫游模式绑定或移除鼠标相关事件
    EventBus.getInstance().on("mode-roaming", (isOpen) => {
      if (isOpen) {
        window.addEventListener("mousedown", this.mousedownFn);
        window.addEventListener("mousemove", this.mousemoveFn);
        window.addEventListener("mouseup", this.mouseupFn);
      } else {
        window.removeEventListener("mousedown", this.mousedownFn);
        window.removeEventListener("mousemove", this.mousemoveFn);
        window.removeEventListener("mouseup", this.mouseupFn);
      }
    });
  }
}
