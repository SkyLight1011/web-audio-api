export class Envelope {
  constructor(plugin, param, mapping = {}) {
    this._plugin = plugin;
    this._param = param;
    this._mapping = mapping;
  }

  get(param) {
    let value = this._plugin.get(this._mapping[param]);

    return typeof value !== 'undefined' ? value : {
      enabled: false,
      delay: 0,
      attack: 0.01,
      hold: 0,
      decay: 0.2,
      sustain: 0,
      release: 0,
      amount: 1,
      min: typeof this._mapping.min !== 'undefined' ? this._mapping.min : this._param.minValue,
      max: typeof this._mapping.max !== 'undefined' ? this._mapping.max : this._param.maxValue
    }[param];
  }

  trigger(at) {
    if (!this.get('enabled')) {
      return;
    }

    this._param.cancelScheduledValues(at);
    this._param.setValueAtTime(this.get('min'), at);
    this._param.setTargetAtTime(this.get('max') * this.get('amount'), at + this.get('delay'), this.get('attack'));
    this._param.setTargetAtTime(this.get('max') * this.get('amount') * this.get('sustain'), at + this.get('delay') + this.get('attack') + this.get('hold'), this.get('decay'));
  }

  release(at) {
    if (!this.get('enabled')) {
      return;
    }

    this._param.cancelScheduledValues(at);
    this._param.setTargetAtTime(this.get('min'), at, this.get('release'));
  }
}
