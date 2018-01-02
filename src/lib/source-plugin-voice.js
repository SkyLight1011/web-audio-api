import {Module} from './module.js';

export class Voice extends Module {
  constructor(plugin, note) {
    super(plugin.context);

    this._plugin = plugin;
    this._note = note;
    this._mount = this.context.createGain();
    this._filter = this.context.createBiquadFilter();
    this._output = this.context.createGain();

    this._filter.type = 'lowpass';

    if (this._plugin.get('filterEnv')) {
      this._mount
        .to(this._filter)
        .to(this._output);
    } else {
      this._mount.to(this._output);
    }
  }

  get frequency() {
    return 440 * Math.pow(2, (this._note - 69) / 12);
  }

  play(at = 0, dur = 0) {
    if (this._plugin.get('gainEnv')) {
      this._mount.gain.cancelScheduledValues(at);
      this._setParamValue(this._mount.gain, 0, at);
      this._setParamValue(this._mount.gain, 1, at + this._plugin.get('gainEnvAttack'), 1);
      this._setParamValue(this._mount.gain, this._plugin.get('gainEnvSustain'), at + this._plugin.get('gainEnvAttack') + this._plugin.get('gainEnvDecay'), 1);
    }

    if (this._plugin.get('filterEnv')) {
      console.log(`start at ${at}, att: ${at + this._plugin.get('filterEnvAttack')}, dec: ${at + this._plugin.get('filterEnvAttack') + this._plugin.get('filterEnvDecay')}`);
      this._filter.frequency.cancelScheduledValues(at);
      this._setParamValue(this._filter.frequency, this._filter.frequency.minValue, at);
      this._setParamValue(this._filter.frequency, this._filter.frequency.maxValue * this._plugin.get('filterEnvAmount'), at + this._plugin.get('filterEnvAttack'), 1);
      this._setParamValue(this._filter.frequency, this._filter.frequency.maxValue * this._plugin.get('filterEnvAmount') * this._plugin.get('filterEnvSustain'), at + this._plugin.get('filterEnvAttack') + this._plugin.get('filterEnvDecay'), 1);
    }
  }

  stop(at = 0, force) {
    if (force || this._plugin.get('gainEnv') || this._plugin.get('filterEnv')) {
      this._mount.gain.cancelScheduledValues(at);
      this._filter.frequency.cancelScheduledValues(at);
    }

    if (this._plugin.get('gainEnv')) {
      this._setParamValue(this._mount.gain, this._mount.gain.value, at);
      this._setParamValue(this._mount.gain, 0, at + this._plugin.get('gainEnvRelease'), 1);
    }

    if (this._plugin.get('filterEnv')) {
      console.log(`stop at ${at}, rel: ${at + this._plugin.get('filterEnvRelease')}`);
      this._setParamValue(this._filter.frequency, this._filter.frequency.value, at);
      this._setParamValue(this._filter.frequency, this._filter.frequency.minValue, at + this._plugin.get('filterEnvRelease'), 1);
    }
  }

  to(target) {
    return this._output.to(target);
  }

  cut(target) {
    this._output.cut(target);
  }

  onended() {}
}
