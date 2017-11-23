export class ParametricEQNode extends GainNode {
  get [Symbol.toStringTag]() {
    return 'ParametricEQNode';
  }

  constructor(ctx, preset = {}) {
    super(ctx);

    this._preset = Object.assign({
      bands: [
        {frequency: 32, Q: 0, gain: 0},
        {frequency: 64, Q: 0.5, gain: 0},
        {frequency: 125, Q: 0.5, gain: 0},
        {frequency: 250, Q: 0.5, gain: 0},
        {frequency: 500, Q: 0.5, gain: 0},
        {frequency: 1000, Q: 0.5, gain: 0},
        {frequency: 2000, Q: 0.5, gain: 0},
        {frequency: 4000, Q: 0.5, gain: 0},
        {frequency: 8000, Q: 0.5, gain: 0},
        {frequency: 16000, Q: 0, gain: 0},
      ]
    }, preset);
    this._input = this.context.createGain();

    this.bands = this._preset.bands.map((preset, i) => {
      let band = this.context.createBiquadFilter();

      band.frequency.value = preset.frequency;
      band.gain.value = preset.gain;
      band.Q.value = preset.Q;

      if (i > 0 && i < this._preset.bands.length - 1) {
        band.type = 'peaking';
      } else if (i === 0) {
        band.type = 'lowshelf';
      } else if (i === this._preset.bands.length - 1) {
        band.type = 'highshelf';
      }

      return band;
    });

    this.bands
      .reduce((prevNode, currentNode) => prevNode.to(currentNode), this._input)
      .connect(this);
  }
}
