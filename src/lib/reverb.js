export class ReverbNode extends GainNode {
  constructor(ctx, seconds, preset = {}) {
    super(ctx);

    let convolver = this.context.createConvolver();
    let raw = this.context.createGain();
    let sampleRate = this.context.sampleRate;
    let length = sampleRate * seconds;
    let impulse = this.context.createBuffer(2, length, sampleRate);
    let impulseL = impulse.getChannelData(0);
    let impulseR = impulse.getChannelData(1);
    let decay = preset.decay || 2;

    this._output = this.context.createGain();

    for (let i = 0; i < length; i++){
      let n = preset.reverse ? length - i : i;

      impulseL[i] = (Math.random() * 2 - 1) * Math.pow(1 - n / length, decay);
      impulseR[i] = (Math.random() * 2 - 1) * Math.pow(1 - n / length, decay);
    }

    convolver.buffer = impulse;
    convolver.normalize = preset.normalize;
    raw.gain.value = preset.raw || 0.2;

    this.connect(convolver).connect(this._output);
    this.connect(raw).connect(this._output);
  }
}
