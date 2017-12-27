export class Param {
  constructor(options = {}) {
    Object.assign(this, {
      name: 'Parameter',
      unit: ''
    }, options);

    if (typeof this.default === 'undefined') {
      if (this.values) {
        this.default = this.values[0];
      } else if (this.boolean) {
        this.default = true;
      } else {
        this.default = 0;
      }
    }

    !this.value && (this.value = this.default);
  }

  get() {
    return this.value;
  }

  set(value, at, type) {
    if (typeof value === 'undefined') {
      value = this.default;
    }

    if (this.boolean) {
      this.value = !!value;
    } else if (this.values) {
      if (this.values.indexOf(value) > -1) {
        this.value = value;
      } else {
        throw new Error(`Invalid value ${value}`);
      }
    } else {
      this.value = Math.min(Math.max(value, this.min), this.max);
    }

    this.callback && this.callback(this.value, at, type);
  }
}
