export class InstrumentVoice {
  constructor(ctx, instrument) {
    this.context = ctx;
    this._instrument = instrument;
    this._output = this.context.createGain();
  }

  setup() {
    this.osc = this.context.createGenerator({
      type: this._instrument.get('osc1Type'),
      detune: this._instrument.get('osc1Detune'),
      vol: this._instrument.get('osc1Vol')
    });
  }

  setNote(note) {}

  rampToNote(note, at = 0, time = 0, type = 0) {}

  play(at = 0, dur = 0) {}

  stop(at = 0) {}

  _getNoteFrequency(note) {

  }
}
