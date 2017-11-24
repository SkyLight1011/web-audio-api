export class EnvelopeNode extends GainNode {
  get [Symbol.toStringTag]() {
    return 'EnvelopeNode';
  }

  constructor(ctx, preset = {}) {
    super(ctx);

    this._preset = Object.assign({
      attack: 0,
      decay: 0,
      sustain: 1,
      release: 0
    }, preset);
  }

  trigger(at = 0, dur = 0) {
    let t = at || this.context.currentTime;

    this._startTime = t;

    this.gain.cancelScheduledValues(t);
    this.gain.setValueAtTime(0, t);
    this.gain.linearRampToValueAtTime(1, t + this._preset.attack);
    this.gain.linearRampToValueAtTime(this._preset.sustain, t + this._preset.attack + this._preset.decay);

    dur && this.release(at + dur);
  }

  release(at = 0, force) {
    let t = at || this.context.currentTime;

    if (this._released) {
      return;
    }

    this._released = true;
    this.gain.cancelScheduledValues(t);

    if (force) {
      this.gain.linearRampToValueAtTime(0, t + 0.001);
    } else {
      this.gain.setValueAtTime(this.gain.value, t);
      this.gain.linearRampToValueAtTime(0, t + this._preset.release);
    }
  }
}
