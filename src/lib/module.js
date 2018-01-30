import {Param} from './param.js';

export class Module {
  constructor(ctx, preset = {}) {
    this.context = ctx;
    this.params = {};

    this.setup();

    this._createParams(this.defaults, preset);

    this.bindParams();
  }

  get defaults() {
    return {
      master: {
        name: 'Master',
        min: 0,
        max: 1,
        step: 0.01,
        default: 1,
        bindings: [this._output.gain]
      },
      mute: {
        name: 'Mute',
        boolean: true,
        default: false,
        callback: (mute) => this._output.mute(mute)
      }
    };
  }

  setup() {
    this._output = this.context.createGain();
  }

  bindParams() {}

  get(name) {
    return this.params[name] && this.params[name].get();
  }

  set(name, value, at = 0, type) {
    if (!this.params[name]) {
      throw new Error(`Unknown parameter ${name}`);
    }

    if (Array.isArray(value)) {
      for (let args of value) {
        (this.params[name] instanceof Param) && this.params[name].set(...args);
      }
    } else {
      (this.params[name] instanceof Param) && this.params[name].set(value, at, type);
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

  to(target) {
    return this._output.to(target);
  }

  cut(target) {
    this._output.cut(target);
  }

  _createParams(params, preset = {}, group) {
    group || (group = this.params);

    for (let name in params) {
      if (this._checkParamSchema(params[name])) {
        group[name] = new Param(this.context, params[name], preset[name]);
      } else {
        this._createParams(params[name], preset[name], this.params[name] = {});
      }
    }
  }

  _checkParamSchema(preset) {
    return 'name' in preset &&
      'default' in preset &&
      (
        'values' in preset ||
        'boolean' in preset ||
        (
          'min' in preset && 'max' in preset
        )
      )
  }
}
