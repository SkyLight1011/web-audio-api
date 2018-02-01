export class LFO extends GainNode {
  constructor(plugin, param, preset = {}) {
    super(plugin.context);

    this._preset = {
      delay: 0,
      attack: 0,
      type: 'sine',
      ...preset
    };
    this._osc = this.context.createGenerator();

    this.params = {
      ...this._preset,
      amount: this._osc.gain,
      speed: this._osc.frequency
    };

    this._osc.to(this).to(param);
  }

  get type() {
    return this._osc.type;
  }

  set type(value) {
    this._osc.type = value;
  }

  start(at) {
    if (this.params.attack || this.params.delay) {
      this.gain.cancelScheduledValues(at);
      this.gain.set(0, at);
      this.gain.set(0, at + this.params.delay);
      this.gain.set(this.params.amount, at + this.params.delay + this.params.attack, 1);
    }

    this._osc.start(at + this.params.delay);
  }

  stop(at) {
    this._osc.stop(at);
  }
}
