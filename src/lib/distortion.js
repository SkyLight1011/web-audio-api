export class DistortionNode extends GainNode {
  constructor(ctx, preset = {}) {
    super(ctx);

    this._preset = Object.assign({
      amount: 400,
      oversample: '4x'
    }, preset);

    let distortion = ctx.createWaveShaper();
    distortion.curve = this._makeDistortionCurve(this._preset.amount);
    distortion.oversample = this._preset.oversample;

    distortion.to(this);

    this._input = distortion;
  }

  _makeDistortionCurve(amount) {
    var k = typeof amount === 'number' ? amount : 50,
      n_samples = this.context.sampleRate || 44100,
      curve = new Float32Array(n_samples),
      deg = Math.PI / 180,
      i = 0,
      x;
    for ( ; i < n_samples; ++i ) {
      x = i * 2 / n_samples - 1;
      curve[i] = ( 3 + k ) * x * 20 * deg / ( Math.PI + k * Math.abs(x) );
    }
    return curve;
  }
}
