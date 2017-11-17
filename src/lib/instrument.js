export class InstrumentNode extends GainNode {
  constructor(ctx, preset = {}) {
    super(ctx);

    this._preset = Object.assign({}, preset);
    this._active = {};
  }

  play(note, at = 0, dur = 0) {
    if (this._active[note]) {
      this._active[note].stop(at);
    }

    let voice = this.context.createVoice(note, this._preset.voice);

    this._active[note] = voice;
    voice.to(this);
    voice.play(at, dur);
  }

  stop(note, at = 0) {
    if (this._active[note]) {
      this._active[note].stop(at);

      this._active[note].onended = () => {
        this._active[note].cut();
        delete this._active[note];
      }
    }
  }

  get [Symbol.toStringTag]() {
    return 'InstrumentNode';
  }
}
