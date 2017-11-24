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

    if (this._preset.lfo) {
      this._preset.lfo.amount || (this._preset.lfo.amount = 1);

      this._lfo = this.context.createGenerator();
      this._mod = this.context.createGain();
      this._modInput = this.context.createGain();
      this._raw = this.context.createGain();
      this._lfoInput = this.context.createGain();

      this._modInput.gain.value = this._preset.lfo.amount;
      this._raw.gain.value = 1 - this._preset.lfo.amount;
      this._lfo.frequency.value = this._preset.lfo.frequency;

      this._lfoInput.to(this._modInput, this._raw);
      this._lfo.to(this._mod.gain);
      this._modInput.to(this._mod).to(output);
      this._raw.to(output);

      this._lfo.start(at);

      output = this._lfoInput;
    }

    let cutoff = this.context.createBiquadFilter();
    cutoff.type = 'highpass';
    cutoff.frequency.value = this._preset.cutoff || 20;
    cutoff.Q.value = 0.5;
    cutoff.to(output);
    output = cutoff;

    this.cutoff = cutoff.frequency;

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

    if (this._lfo) {
      this._lfo.stop(t);

      this._lfo.onended = () => this._lfo.cut();
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
