export class Param {
  constructor(ctx, options = {}, value) {
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

    this._value = value || this.default;

    if (!this.values && !this.boolean) {
      this._signalSource = this.context.createCustomConstantSource();
      this._signalSource.offset.setValueAtTime(this._value, this.context.currentTime);
      this._signalSource.start(this.context.currentTime);
    }

    this._callbacks = [];

    if (this.bindings) {
      if (Array.isArray(this.bindings)) {
        for (let binding of this.bindings) {
          this.bindTo(binding);
        }
      } else {
        this.bindTo(this.bindings);
      }
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

    for (let cb of this._callbacks) {
      cb(this._value, at, type);
    }
  }

  reset() {
    this._value = this.default;
  }

  onChange(cb) {
    this._callbacks.push(cb);
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

  bindTo(node) {
    let param;

    if (Array.isArray(node)) {
      [node, param] = node;
    }

    if (node instanceof AudioParam) {
      this.to(node);
    } else if (node instanceof AudioNode && param) {
      this._callbacks.push(value => node[param] = value);
    }
  }

  cut(target) {
    if (this._signalSource) {
      this._signalSource.cut(target);
    }
  }
}
