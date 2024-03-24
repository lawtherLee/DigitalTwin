// 整个项目 - 动效管理类
// 要做动效的实例对象加入到这里，后续会不断分别调度每个实例对象内置的onTick方法
export class EffectManager {
  constructor() {
    this.list = [];
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new EffectManager();
    }
    return this.instance;
  }
  // 添加要做动效的实例
  addObj(obj) {
    this.list.push(obj);
  }
  tickForEach(t) {
    // t: 将来渲染循环传过来的毫秒级时间数值
    this.list.forEach((obj) => {
      obj.onTick(t);
    });
  }
}
