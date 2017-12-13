export class CommonParam {
  constructor(plugin, options = {}) {
    if (!plugin) {
      throw new Error('Parameter is not assigned to plugin');
    }

    this._plugin = plugin;

    Object.assign(this, this.defaults, options);
  }

  get defaults() {
    return {
      min: 0,
      max: 1,
      step: 0.01,
      default: 1,
      title: '',
      unit: ''
    };
  }

  get() {
    return this._value;
  }

  set(value, time = 0, type = 0) {
    if (value === undefined) {
      value = this.default;
    }

    this._value = Math.min(Math.max(value, this.min), this.max);

    this.callback && this.callback(value, time, type);
  }

  get value() {
    return this.get();
  }

  set value(value) {
    this.set(value, this._plugin.context.currentTime);
  }
}
