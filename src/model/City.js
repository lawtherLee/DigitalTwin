import { BaseModel } from "@/model/BaseModel.js";
import * as THREE from "three";
export class City extends BaseModel {
  init() {
    this.scene.add(this.model);
    this.initEffect();
  }
  // 初始化城市效果
  initEffect() {
    // 中心城市建筑
    const centerMaterial = new THREE.MeshBasicMaterial({
      color: "red",
      transparent: true,
    });
    // 外围城市建筑
    const periphery = new THREE.MeshBasicMaterial({
      color: "green",
      transparent: true,
    });
    this.model.traverse((model) => {
      // 隐藏建筑名字
      if (model.name === "Text") model.visible = false;
      // 排除地板和河水物体
      if (
        model.name !== "Shanghai-09-Floor" &&
        model.name !== "Shanghai-08-River"
      ) {
        if (
          model.name === "Shanghai-02" ||
          model.name === "Shanghai-03" ||
          model.name === "Shanghai-04" ||
          model.name === "Shanghai-05" ||
          model.name === "Shanghai-06" ||
          model.name === "Shanghai-07"
        ) {
          // 周围建筑
          model.material = periphery;
        } else {
          // 中心建筑
          model.material = centerMaterial;
        }
      }
    });
  }
}