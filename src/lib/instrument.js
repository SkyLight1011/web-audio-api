export class InstrumentNode extends GainNode {
  get [Symbol.toStringTag]() {
    return 'InstrumentNode';
  }

  constructor(ctx, config = {}) {
    super(ctx);

    this.name = config.name;
    this._preset = Object.assign({}, config.preset);
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
    if (!note) {
      for (let note in this._active) {
        this.stop(note);
      }

      return;
    }

    if (this._active[note]) {
      this._active[note].stop(at);

      this._active[note].onended = () => {
        this._active[note].cut();
        delete this._active[note];
      }
    }
  }
}
