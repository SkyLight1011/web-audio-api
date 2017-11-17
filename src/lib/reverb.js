export class ReverbNode extends GainNode {
  constructor(ctx, seconds, preset = {}) {
    super(ctx);

    this._preset = Object.assign({
      decay: 2,
      reverse: false,
      raw: 0.5
    }, preset);

    let convolver = this.context.createConvolver();
    let convVol = this.context.createGain();
    let raw = this.context.createGain();
    let sampleRate = this.context.sampleRate;
    let length = sampleRate * seconds;
    let impulse = this.context.createBuffer(2, length, sampleRate);
    let impulseL = impulse.getChannelData(0);
    let impulseR = impulse.getChannelData(1);
    let decay = this._preset.decay;

    this._output = this.context.createGain();

    for (let i = 0; i < length; i++){
      let n = this._preset.reverse ? length - i : i;

      impulseL[i] = (Math.random() * 2 - 1) * Math.pow(1 - n / length, decay);
      impulseR[i] = (Math.random() * 2 - 1) * Math.pow(1 - n / length, decay);
    }

    convolver.buffer = impulse;
    convolver.normalize = preset.normalize;
    convVol.gain.value = 1 - this._preset.raw;
    raw.gain.value = this._preset.raw;

    this.connect(convolver).to(convVol).to(this._output);
    this.connect(raw).to(this._output);
  }
}
