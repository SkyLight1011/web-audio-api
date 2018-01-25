export class Param {
  constructor(ctx, options = {}) {
    this.context = ctx;

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

    this._value = this.default;

    if (!this.values && !this.boolean) {
      this._signalSource = this.context.createCustomConstantSource();
      this._signalSource.offset.setValueAtTime(this._value, this.context.currentTime);
      this._signalSource.start(this.context.currentTime);
    }
  }

  get value() {
    return this._value;
  }

  set value(value) {
    this.set(value);
  }

  get() {
    return this._value;
  }

  set(value, at, type) {
    if (typeof value === 'undefined') {
      value = this.default;
    }

    if (this.boolean) {
      this._value = !!value;
    } else if (this.values) {
      if (this.values.indexOf(value) > -1) {
        this._value = value;
      } else {
        throw new Error(`Invalid value ${value}`);
      }
    } else {
      this._value = Math.min(Math.max(value, this.min), this.max);
    }

    if (this._signalSource) {
      this._signalSource.offset.set(this._value, at, type);
    }

    this.callback && this.callback(this._value, at, type);
  }

  reset() {
    this._value = this.default;
  }

  to(...args) {
    let targets = [];
    let relative = false;

    for (let arg of args) {
      if (typeof arg === 'object') {
        targets.push(arg);
      } else {
        relative = !!arg;

        break;
      }
    }

    if (this._signalSource) {
      if (!relative) {
        for (let target of targets) {
          if (target instanceof AudioParam) {
            target.set(0);
          }
        }
      }

      return this._signalSource.to(...targets);
    }

    return null;
  }

  cut(target) {
    if (this._signalSource) {
      this._signalSource.cut(target);
    }
  }
}
