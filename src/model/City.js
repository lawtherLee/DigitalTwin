import { BaseModel } from "@/model/BaseModel.js";
import * as THREE from "three";
import { EdgesLine } from "@/effect/EdgesLine.js";
import { modifyCityDefaultMaterial } from "@/shader/modifyCityMaterial.js";
import { CityWater } from "@/effect/CityWater.js";
import { getBoxCenter } from "@/utils/getBoxCenter.js";
import { Fire } from "@/effect/Fire.js";
import { FireBall } from "@/effect/FireBall.js";
import { BuildInfo } from "@/dom/BuildInfo.js";
import { EffectManager } from "@/utils/EffectManager.js";
import { ClickHandler } from "@/utils/ClickHandler.js";
export class City extends BaseModel {
  init() {
    this.scene.add(this.model);
    this.buildNameObj = {
      // 模型名字和建筑显示名字对应关系
      "01-shanghaizhongxindasha": "上海中心大厦",
      "02-huanqiujinrongzhongxin": "环球金融中心",
      "03-jinmaodasha": "金茂大厦",
      "04-dongfangmingzhu": "东方明珠",
    };
    this.initEffect();
    this.initFire("01-shanghaizhongxindasha");
    this.bindClick();
  }
  // 初始化城市效果
  initEffect() {
    // 中心城市建筑
    const centerMaterial = new THREE.MeshBasicMaterial({
      color: 0xa8cded,
      transparent: true,
    });
    // 外围城市建筑
    const periphery = new THREE.MeshBasicMaterial({
      color: 0xa8cded,
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
          new EdgesLine(this.scene, model, new THREE.Color("#00ffff"));
          modifyCityDefaultMaterial(model, true);
        }
      }
      // 针对水物体单独处理
      if (model.name === "Shanghai-08-River") {
        model.visible = false;
        const theWater = new CityWater(model, this.scene);
        EffectManager.getInstance().addObj(theWater);
      }
    });
  }

  // 创建火灾标记
  initFire(buildName) {
    const build = this.model.getObjectByName(buildName);
    const { center, size } = getBoxCenter(build);
    new Fire(this.scene, center, size);
    const ball = new FireBall(this.scene, center);
    // 注册动效管理
    EffectManager.getInstance().addObj(ball);
  }

  // 中心4个建筑绑定点击事件
  bindClick() {
    Object.keys(this.buildNameObj).forEach((key) => {
      const build = this.model.getObjectByName(key);
      ClickHandler.getInstance().addMesh(build, (object) => {
        const { center } = getBoxCenter(object);
        new BuildInfo(this.scene, center, {
          squareMeters: "500",
          name: this.buildNameObj[object.name],
          officesRemain: 500,
          accommodate: 500,
          parkingRemain: 88,
        });
        // new BuildInfo(
        //   this.scene,
        //   center,
        //   this.dataObj.buildingsIntroduce[object.name],
        // );
      });
    });
  }
}
