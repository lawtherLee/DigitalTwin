import * as THREE from "three";
// 城市边缘边线效果
export class EdgesLine {
  constructor(scene, mesh, color) {
    this.scene = scene;
    this.mesh = mesh;
    this.color = color;

    this.init();
  }

  init() {
    const edgesGeometry = new THREE.EdgesGeometry(this.mesh.geometry);
    const material = new THREE.LineBasicMaterial({ color: this.color });
    const line = new THREE.LineSegments(edgesGeometry, material);
    // 默认是垂直的 需要调整角度
    line.position.copy(this.mesh.position);
    line.rotation.copy(this.mesh.rotation);
    line.scale.copy(this.mesh.scale);
    this.scene.add(line);
  }
}
