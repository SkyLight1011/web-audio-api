export class VoiceNode extends GainNode {
  constructor(ctx, note, preset = {}) {
    super(ctx);

    this._note = note;
    this._preset = preset;
    this._osc = [];
  }

  play(at = 0, dur = 0) {
    this._setup();

    for (let osc of this._osc) {
      osc.connect(this);
      osc.start(at);
    }

    dur && this.stop(at + dur);
  }

  stop(at = 0) {
    for (let osc of this._osc) {
      osc.stop(at);
      osc.disconnect();
    }
  }

  _setup() {
    for (let i = 0; i++ < 3;) {
      let osc = this.context.createGenerator();

      osc.type = 'sawtooth';
      osc.frequency.value = this._frequencyFromNoteNumber(this._note);

      this._osc.push(osc);
    }

    this._osc[1].detune.value = -1700;
    this._osc[2].detune.value = -2400;
  }

  _frequencyFromNoteNumber(note) {
    return 440 * Math.pow(2, (note - 69) / 12);
  }
}
