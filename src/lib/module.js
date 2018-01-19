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
  }

  get defaults() {
    return {
      master: {
        name: 'Master',
        min: 0,
        max: 1,
        step: 0.01,
        default: 1,
        callback: (value, at, type) => this._setParamValue(this._output.gain, value, at, type)
      }
    };
  }

  setup() {
    this._output = this.context.createGain();
  }

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

  reset(name) {
    if (!name) {
      for (let param of this.params) {
        param.reset();
      }
    } else {
      this.params[name].reset();
    }
  }

  get effectivePreset() {
    let preset = {};

    for (let param in this.params) {
      preset[param] = this.get(param);
    }

    return preset;
  }

  get preset() {
    const effectivePreset = this.effectivePreset;

    return Object.keys(this.params).reduce((res, key) => {
      if (this.params[key].default !== this.effectivePreset[key]) {
        res[key] = this.effectivePreset[key];
      }

      return res;
    }, {});
  }

  set preset(preset) {
    if (!preset) {
      return;
    }

    this._preset = preset;

    for (let param in this.params) {
      this.set(param, this._preset[param]);
    }
  }

  _setParamValue(param, value, at = 0, type = 0) {
    let dur = 0;

    if (Array.isArray(at)) {
      [at, dur] = at;
    }

    at = Math.max(at, this.context.currentTime);

    switch (type) {
      case 1:
        param.linearRampToValueAtTime(value, at);
        break;
      case 2:
        param.exponentialRampToValueAtTime(Math.max(value, 0.0001), at);
        break;
      case 3:
        param.setTargetAtTime(Math.max(value, 0.0001), at, dur);
        break;
      default:
        param.setValueAtTime(value, at);
    }
  }
}
