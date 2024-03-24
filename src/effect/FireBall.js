import * as THREE from "three";
// 火宅影响范围-球体标记
export class FireBall {
  constructor(scene, center) {
    this.scene = scene;
    this.center = center;

    this.init();
  }
  init() {
    const geometry = new THREE.SphereGeometry(
      25,
      32,
      16,
      0,
      Math.PI * 2, // 水平方向扫描角度
      0,
      Math.PI / 2, // 垂直方向扫描角度（一半）- 半球体
    );
    const material = new THREE.MeshBasicMaterial({
      color: new THREE.Color("#f4790d"),
      side: THREE.DoubleSide,
      depthTest: false, // 关闭深度测试(透视效果) - 多个像素点同时渲染
    });
    const sphere = new THREE.Mesh(geometry, material);
    sphere.position.set(this.center.x, 0, this.center.z);
    this.scene.add(sphere);
  }
}
