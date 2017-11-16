export class EnvelopeNode extends GainNode {
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
    let t = this.context.currentTime + at;

    this.gain.cancelScheduledValues(t);
    this.gain.setValueAtTime(0, t);
    this.gain.linearRampToValueAtTime(1, t + this._preset.attack);
    this.gain.linearRampToValueAtTime(this._preset.sustain, t + this._preset.attack + this._preset.decay);

    dur && this.release(at + dur);
  }

  release(at = 0) {
    let t = this.context.currentTime + at;

    this.gain.cancelScheduledValues(t);
    this.gain.setValueAtTime(this.gain.value, t);
    this.gain.linearRampToValueAtTime(0, t + this._preset.release);
  }
}
