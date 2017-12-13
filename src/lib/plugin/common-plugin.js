import {CommonParam, OptionsParam, BooleanParam} from './params/index.js';

export class CommonPlugin {
  constructor(ctx, preset = {}) {
    this.context = ctx;
    this._params = {};

    this.initParams(this.paramConfig);

    this.preset = preset;
  }

  get paramConfig() {
    return {};
  }

  initParams(params = {}) {
    for (let param in params) {
      let Param = params[param].boolean ? BooleanParam : ('options' in params[param]) ? OptionsParam : CommonParam;

      this._params[param] = new Param(this, params[param]);
    }
  }

  connect(target) {
    this._output.connect(target._input || target);

    return target;
  }

  disconnect(target) {
    this._output.disconnect(target._input || target);
  }

  get(param) {
    return this._params[param] ? this._params[param].value : null;
  }

  set(param, value) {
    if (this._params[param]) {
      this._params[param].set(value, this.context.currentTime);
    }
  }

  set preset(preset) {
    for (let param in preset) {
      this._params[param].value = preset[param];
    }
  }

  get preset() {
    let preset = {};

    for (let param in this._params) {
      preset[param] = this._params[param].value;
    }

    return preset;
  }
}
