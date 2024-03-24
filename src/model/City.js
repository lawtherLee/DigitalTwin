import { BaseModel } from "@/model/BaseModel.js";
import * as THREE from "three";
import { EdgesLine } from "@/effect/EdgesLine.js";
import { modifyCityDefaultMaterial } from "@/shader/modifyCityMaterial.js";
import { CityWater } from "@/effect/CityWater.js";
import { getBoxCenter } from "@/utils/getBoxCenter.js";
import { Fire } from "@/effect/Fire.js";
import { FireBall } from "@/effect/FireBall.js";
export class City extends BaseModel {
  init() {
    this.scene.add(this.model);
    this.initEffect();
    this.initFire("01-shanghaizhongxindasha");
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
      color: "#a4ccee",
      transparent: true,
    });
    this.model.traverse((model) => {
      // 隐藏建筑名字
      if (model.name === "Text") {
        model.visible = false;
        return;
      }
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
          new EdgesLine(this.scene, model, new THREE.Color("#666"));
          modifyCityDefaultMaterial(model, false);
        } else {
          // 中心建筑
          model.material = centerMaterial;
          new EdgesLine(this.scene, model, new THREE.Color("red"));
          modifyCityDefaultMaterial(model, true);
        }
      }
      // 针对水物体单独处理
      if (model.name === "Shanghai-08-River") {
        model.visible = false;
        new CityWater(model, this.scene);
      }
    });
  }

  // 创建火灾标记
  initFire(buildName) {
    const build = this.model.getObjectByName(buildName);
    const { center, size } = getBoxCenter(build);
    new Fire(this.scene, center, size);
    new FireBall(this.scene, center);
  }
}
