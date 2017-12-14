import {CommonParam} from './common-param.js';

export class OptionsParam extends CommonParam {
  constructor(plugin, options = {}) {
    super(plugin, options);

    if (!this.default && this.default !== null) {
      this.default = this.options[0];
    }
  }

  get defaults() {
    return {
      default: '',
      options: [],
      title: '',
      unit: ''
    }
  }

  set(value) {
    if (value === undefined) {
      value = this.default;
    }

    if (this.options && this.options.indexOf(value) > -1) {
      this._value = value;
    } else {
      throw new Error(`<${value}> is not a valid value for this parameter`);
    }

    this.callback && this.callback(value, time, type);
  }
}
