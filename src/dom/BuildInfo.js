import { CSS2DObject } from "three/addons/renderers/CSS2DRenderer.js";

// 2D物体 - 建筑信息
export class BuildInfo {
  constructor(scene, center, dataObj) {
    this.scene = scene;
    this.center = center;
    this.dataObj = dataObj;

    this.list = []; // 用来保存名字信息的2个2d物体

    this.createNameDiv();
    this.createInfoDiv();
  }

  // 建筑名字的2D物体
  createNameDiv() {
    const nameDiv = document.querySelector("#tag-1");
    nameDiv.innerHTML = this.dataObj.name; // 建筑名字
    // 标签虽然有display：none 但是转化成2D物体后会在2D渲染器中直接显示
    const nameObject = new CSS2DObject(nameDiv);
    nameObject.position.set(this.center.x, this.center.y + 10, this.center.z);
    this.scene.add(nameObject);
    this.list.push(nameObject);
  }

  // 建筑信息的2D物体
  createInfoDiv() {
    const infoDiv = document.querySelector("#tag-2");
    infoDiv.style.pointerEvents = "all";
    const { squareMeters, accommodate, officesRemain, parkingRemain } =
      this.dataObj;
    infoDiv.innerHTML = `
    <div>总平米数： ${squareMeters}</div>
    <div>容纳人数： ${accommodate}</div>
    <div>可出租位： ${officesRemain}</div>
    <div>空余车位： ${parkingRemain}</div>
      `;

    const infoObject = new CSS2DObject(infoDiv);
    infoObject.position.set(this.center.x, this.center.y + 5, this.center.z);
    this.scene.add(infoObject);
    this.list.push(infoObject);

    // dom点击 隐藏此建筑物的标签
    infoDiv.addEventListener("click", (e) => {
      e.stopPropagation();
      this.clear.call(this);
    });
  }

  clear() {
    this.list.forEach((obj) => (obj.visible = false));
  }
}
