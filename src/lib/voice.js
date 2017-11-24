export class VoiceNode extends GainNode {
  get [Symbol.toStringTag]() {
    return 'VoiceNode';
  }

  constructor(ctx, note, preset = {}) {
    super(ctx);

    this._note = note;
    this._preset = preset;
    this._osc = [];

    this._preset.gain && (this.gain.value = this._preset.gain);
  }

  play(at = 0, dur = 0) {
    let output = this;

    this._setup();

    if (this._preset.env) {
      this._env = this.context.createEnvelope(this._preset.env);

      this._env.to(output);
      this._env.trigger(at);

      output = this._env;
    }

    if (this._preset.noize) {
      this._noize = this.context.createNoize(this._preset.noize.type || 'white');

      this._noize.gain.value = this._preset.noize.gain || 1;
      this._noize.detune.value = this._preset.noize.detune || 0;

      this._noize.to(output);
      this._noize.start(at);
    }

    for (let osc of this._osc) {
      osc.to(output);
      osc.start(at);
    }

    dur && this.stop(at + dur);
  }

  stop(at = 0, force) {
    let t = at + (this._env ? this._preset.env.release : 0);

    if (this._env) {
      this._env.release(at, force);
    }

    for (let osc of this._osc) {
      osc.stop(t);

      osc.onended = () => osc.cut();
    }

    if (this._noize) {
      this._noize.stop(t);

      this._noize.onended = () => this._noize.cut();
    }
  }

  _setup() {
    let oscIndex = 1;

    for (let preset of this._preset.osc) {
      let osc = this.context.createGenerator();

      osc.name = preset.name || `OSC ${oscIndex++}`;
      osc.type = preset.type || 'sine';
      osc.detune.value = preset.detune || 0;
      osc.gain.value = preset.gain || 1;
      osc.frequency.value = this._frequencyFromNoteNumber(this._note);

      this._osc.push(osc);
    }
  }

  _frequencyFromNoteNumber(note) {
    return 440 * Math.pow(2, (note - 69) / 12);
  }
}
