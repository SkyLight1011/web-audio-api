import {CommonParam} from './common-param.js';

export class BooleanParam extends CommonParam {
  constructor(plugin, options = {}) {
    super(plugin, options);
  }

  get defaults() {
    return {
      boolean: true,
      default: false,
      title: '',
      unit: ''
    }
  }

  set(value) {
    if (value === undefined) {
      value = this.default;
    }

    this._value = !!value;

    this.callback && this.callback(value, time, type);
  }
}
