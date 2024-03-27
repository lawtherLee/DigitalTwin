import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { FBXLoader } from "three/addons/loaders/FBXLoader.js";
import * as THREE from "three";
import { gsap } from "gsap";

const manager = new THREE.LoadingManager();

/**
 * 加载模型对象
 * @param pathList 模型文件路径数组
 * @param suc 成功的回调
 */
export function loadManager(pathList, suc) {
  const gltfLoader = new GLTFLoader(manager);
  const fbxLoader = new FBXLoader(manager);

  // 保存加载成功的模型对象数组
  const model = [];

  let preValue = 0; // 上一次进度值
  // 加载器对象关联属性和回调函数
  manager.onProgress = (url, loadedNum, totalNum) => {
    // url: 当前被加载完成的模型路径
    // loadedNum: 当前加载完成的个数(根据你传入到 new 加载器的个数决定的)
    // totalNum: 总共要加载的个数
    let progressRatio = Math.floor((loadedNum / totalNum) * 100);
    gsap.fromTo(
      "#processing-number",
      { innerText: preValue },
      {
        innerText: progressRatio,
        onUpdate() {
          // 取出当前正在做动画的目标对象的属性值(进度数字)
          const num = gsap.getProperty(this.targets()[0], "innerText");
          this.targets()[0].innerText = num + "%";
          preValue = progressRatio;
          if (num === 100) {
            suc(model);
            document.querySelector(".loading").style.display = "none";
          }
        },
      },
    );
    // 进度条动画
    gsap.fromTo(
      "#loading-bar",
      {
        scaleX: preValue / 100,
      },
      { scaleX: progressRatio / 100 },
    );
  };

  pathList.forEach((pathItem) => {
    if (pathItem.indexOf("fbx") > -1) {
      fbxLoader.load(pathItem, (fbx) => {
        model.push({
          model: fbx,
          url: pathItem,
        });

        // model.length === pathList.length && suc(model);
      });
    } else if (pathItem.indexOf("gltf") > -1) {
      gltfLoader.load(pathItem, (gltf) => {
        model.push({
          model: gltf.scene,
          url: pathItem,
        });
        // model.length === pathList.length && suc(model);
      });
    }
  });
}
