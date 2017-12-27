export class Voice {
  constructor(plugin, note) {
    this.context = plugin.context;
    this._plugin = plugin;
    this._note = note;
    this._output = this.context.createGain();
  }

  get frequency() {
    return 440 * Math.pow(2, (this._note - 69) / 12);
  }

  play(at = 0, dur = 0) {}

  stop(at = 0, force) {}

  to(target) {
    return this._output.to(target);
  }

  cut(target) {
    this._output.cut(target);
  }

  onended() {}
}
