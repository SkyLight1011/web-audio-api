export class GeneratorNode extends GainNode {
  get [Symbol.toStringTag]() {
    return 'GeneratorNode';
  }

  constructor(ctx, preset = {}) {
    super(ctx);

    this._preset = Object.assign({
      type: 'sine',
      frequency: 440,
      detune: 0,
      gain: 1
    }, preset);

    this._osc = this.context.createOscillator();

    for (let key of ['type', 'frequency', 'detune']) {
      this[key] = this._osc[key];
    }

    this.type = this._preset.type;
    this.frequency.value = this._preset.frequency;
    this.detune.value = this._preset.detune;
    this.gain.value = this._preset.gain;

    this._osc.to(this);
  }

  get type() {
    return this._osc.type;
  }

  set type(value) {
    this._osc.type = value;
  }

  start(at = 0, dur = 0) {
    !at && (at = this.context.currentTime);

    this._osc.start(at);

    dur && this.stop(at + dur);
  }

  stop(at = 0) {
    !at && (at = this.context.currentTime);

    this._osc.stop(at);
  }

  set onended(callback) {
    this._osc.onended = callback;
  }
}
