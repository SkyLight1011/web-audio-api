export class VoiceNode extends GainNode {
  constructor(ctx, note, preset = {}) {
    super(ctx);

    this._note = note;
    this._preset = preset;
    this._osc = [];
  }

  play(at = 0, dur = 0) {
    let output = this;

    this._setup();

    if (this._preset.env) {
      this._env = this.context.createEnvelope(this._preset.env);

      this._env.to(output);
      this._env.trigger(at, dur);

      output = this._env;
    }

    for (let osc of this._osc) {
      osc.to(output);
      osc.start(at);
    }

    dur && this.stop(at + dur);
  }

  stop(at = 0) {
    if (this._env) {
      this._env.release(at);
    }

    for (let osc of this._osc) {
      osc.stop(at + this._env ? this._preset.env.r : 0);

      osc.onended = () => {
        osc.cut();
      }
    }
  }

  _setup() {
    for (let i = 0; i < 2; i++) {
      let osc = this.context.createGenerator();

      osc.type = this._preset.osc[i].type || 'sine';
      osc.detune.value = this._preset.osc[i].detune || 0;
      osc.gain.value = this._preset.osc[i].gain || 1;
      osc.frequency.value = this._frequencyFromNoteNumber(this._note);

      this._osc.push(osc);
    }
  }

  _frequencyFromNoteNumber(note) {
    return 440 * Math.pow(2, (note - 69) / 12);
  }
}
