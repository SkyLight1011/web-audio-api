export class LFO extends GainNode {
  constructor(plugin, param, preset = {}) {
    super(plugin.context);

    this._preset = preset;
    this._osc = this.context.createGenerator();

    this.amount = this._osc.gain;
    this.speed = this._osc.frequency;
    this.delay = preset.delay || 0;
    this.attack = preset.attack || 0;

    this._osc.to(this).to(param);
  }

  get type() {
    return this._osc.type;
  }

  set type(value) {
    this._osc.type = value;
  }

  start(at) {
    if (this.attack || this.delay) {
      this.gain.cancelScheduledValues(at);
      this.gain.set(0, at);
      this.gain.set(0, at + this.delay);
      this.gain.set(this.amount.value, at + this.delay + this.attack, 1);
    }

    this._osc.start(at + this.delay);
  }

  stop(at) {
    this._osc.stop(at);
  }
}
