// 基础模型
export class BaseModel {
  constructor(model, scene, camera, control) {
    this.model = model;
    this.scene = scene;
    this.camera = camera;
    this.control = control;

    // 调用子类init 因为子类继承无需constructor
    this.init();
  }
}
