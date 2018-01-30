export class LFO {
  constructor(plugin, param, preset = {}) {
    this.context = plugin.context;

    this._preset = preset;
    this._osc = this.context.createGenerator({
      type: this._preset.type,
      frequency: this._preset.speed,
      gain: this._preset.amount
    });

    this.amount = this._osc.gain;
    this.speed = this._osc.frequency;
    this.delay = preset.delay;
    this.attack = preset.attack;

    this._osc.to(param);
  }

  get type() {
    return this._osc.type;
  }

  set type(value) {
    this._osc.type = value;
  }

  start(at) {
    at += this.delay || 0;

    if (this.attack) {
      this._osc.gain.cancelScheduledValues(at);
      this._osc.gain.setValueAtTime(0, at);
      this._osc.gain.setTargetAtTime(this._preset.amount, at, this.attack);
    }

    this._osc.start(at);
  }

  stop(at) {
    this._osc.stop(at);
  }

  to(...args) {
    return this._osc.to(...args);
  }

  cut(target) {
    this._osc.cut(target);
  }
}
