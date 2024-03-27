import * as THREE from "three";
// 火宅标记类
export class Fire {
  constructor(scene, center, size) {
    this.scene = scene;
    this.center = center; // 建筑物中心点三维向量对象
    this.size = size; // 建筑物大小的三维向量对象

    this.init();
  }
  init() {
    const texture = new THREE.TextureLoader().load("icon/fire.png");
    texture.colorSpace = THREE.SRGBColorSpace;
    const spriteMaterial = new THREE.SpriteMaterial({
      map: texture,
    });
    const sprite = new THREE.Sprite(spriteMaterial);
    sprite.position.set(
      this.center.x,
      this.center.y + this.size.y / 2 + 3,
      this.center.z,
    );
    sprite.scale.set(10, 10, 10);
    this.scene.add(sprite);

    this.model = sprite;
  }
  clear() {
    this.scene.remove(this.model);
  }
}
