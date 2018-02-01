export class Envelope {
  constructor(plugin, param, preset = {}) {
    this.context = plugin.context;

    this._plugin = plugin;
    this._param = param;
    this._preset = {
      enabled: false,
      min: this._param.minValue,
      max: this._param.maxValue,
      amount: 0,
      delay: 0,
      attack: 0.001,
      hold: 0,
      decay: 0.001,
      sustain: this._param.maxValue / 2,
      release: 0.001,
      ...preset
    };

    this.params = {
      ...this._preset
    };
  }

  trigger(at) {
    if (!this.params.enabled) {
      return;
    }

    this._param.cancel(at);
    this._param.set(this.params.min, at);
    this._param.set(this.params.max * this.params.amount, [at + this.params.delay, this.params.attack], 3);
    this._param.set(this.params.max * this.params.amount * this.params.sustain, [at + this.params.delay + this.params.attack + this.params.hold, this.params.decay], 3);
  }

  release(at) {
    if (!this.params.enabled) {
      return;
    }

    this._param.cancel(at);
    this._param.set(this.params.min, [at, this.params.release], 3);
  }
}
