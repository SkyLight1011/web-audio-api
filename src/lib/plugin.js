import {Param} from './param.js';

export class Plugin {
  constructor(ctx, preset = {}) {
    this.context = ctx;
    this._mount = this.context.createGain();
    this._output = this.context.createGain();
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

  static get id() {
    return 'plugin';
  }

  get defaults() {
    return {
      master: {
        name: 'Master',
        min: 0,
        max: 1,
        step: 0.01,
        default: 1,
        callback: (value, at, type) => this._output.gain.set(value, at, type)
      },
      mute: {
        name: 'Mute',
        boolean: true,
        default: false,
        callback: (mute) => this._output.gain.set(mute ? 0 : this.get('master'))
      }
    }
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

  to(target) {
    return this._output.to(target);
  }

  cut(target) {
    this._output.cut(target);
  }
}
