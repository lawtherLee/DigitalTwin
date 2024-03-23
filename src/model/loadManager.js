import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { FBXLoader } from "three/addons/loaders/FBXLoader.js";

/**
 * 加载模型对象
 * @param pathList 模型文件路径数组
 * @param suc 成功的回调
 */
export function loadManager(pathList, suc) {
  const gltfLoader = new GLTFLoader();
  const fbxLoader = new FBXLoader();

  // 保存加载成功的模型对象数组
  const model = [];
  pathList.forEach((pathItem) => {
    if (pathItem.indexOf("fbx") > -1) {
      fbxLoader.load(pathItem, (fbx) => {
        model.push({
          model: fbx,
          url: pathItem,
        });

        model.length === pathList.length && suc(model);
      });
    } else if (pathItem.indexOf("gltf") > -1) {
      gltfLoader.load(pathItem, (gltf) => {
        model.push({
          model: gltf.scene,
          url: pathItem,
        });
        model.length === pathList.length && suc(model);
      });
    }
  });
}
