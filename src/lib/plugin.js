import {Param} from './param.js';

export class Plugin {
  constructor(ctx, preset = {}) {
    this.context = ctx;
    this._mount = this.context.createGain();
    this._output = this.context.createGain();
    this.params = {};

    this._mount.to(this._output);

    for (let name in this.defaults) {
      this.params[name] = new Param(this.defaults[name]);
    }

    this.preset = preset;
  }

  get defaults() {
    return {
      master: {
        name: 'Master',
        min: 0,
        max: 1,
        step: 0.01,
        callback: (value, at, type) => this._output.gain.set(value, at, type)
      },
      mute: {
        name: 'Mute',
        boolean: true,
        callback: (mute) => this._output.gain.set(mute ? 0 : this.params.get('master'))
      }
    }
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

  to(target) {
    return this._output.to(target);
  }

  cut(target) {
    this._output.cut(target);
  }
}
