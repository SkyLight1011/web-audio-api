export class Voice {
  constructor(plugin, note) {
    this.context = plugin.context;
    this._plugin = plugin;
    this._note = note;
    this._mount = this.context.createGain();
    this._output = this.context.createGain();

    this._mount.to(this._output);
  }

  get frequency() {
    return 440 * Math.pow(2, (this._note - 69) / 12);
  }

  play(at = 0, dur = 0) {
    if (this._plugin.get('gainEnv')) {
      this._mount.gain.cancelScheduledValues(at);
      this._mount.gain.set(0, at);
      this._mount.gain.set(1, at + this._plugin.get('gainEnvAttack'), 1);
      this._mount.gain.set(this._plugin.get('gainEnvSustain'), at + this._plugin.get('gainEnvAttack') + this._plugin.get('gainEnvDecay'), 1);
    }
  }

  stop(at = 0, force) {
    if (this._plugin.get('gainEnv')) {
      this._mount.gain.cancelScheduledValues(at);
      this._mount.gain.set(this._mount.gain.value, at);
      this._mount.gain.set(0, at + this._plugin.get('gainEnvRelease'), 1);
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
