import {Param} from './param.js';

export class Module {
  constructor(ctx, preset = {}) {
    this.context = ctx;
    this.params = {};

    for (let name in this.defaults) {
      this.params[name] = new Param(this.defaults[name]);
    }

    this.setup();

    this.preset = preset;

    for (let param in this.preset) {
      this.set(param, this.preset[param]);
    }
  }

  get defaults() {
    return {};
  }

  setup() {}

  get(name) {
    return this.params[name] && this.params[name].get();
  }

  set(name, value, at = 0, type) {
    if (!this.params[name]) {
      throw new Error(`Unknown parameter ${name}`);
    }

    if (Array.isArray(value)) {
      for (let args of value) {
        this.params[name].set(...args);
      }
    } else {
      this.params[name].set(value, at, type);
    }
  }

  get preset() {
    let preset = {};

    for (let param in this.params) {
      preset[param] = this.get(param);
    }

    return preset;
  }

  set preset(preset) {
    if (!preset) {
      return;
    }

    for (let param in preset) {
      this.set(param, preset[param]);
    }
  }
}
