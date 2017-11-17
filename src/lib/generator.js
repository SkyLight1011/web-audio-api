export class GeneratorNode extends GainNode {
  constructor(ctx) {
    super(ctx);

    this._osc = this.context.createOscillator();

    for (let key of ['type', 'frequency', 'detune']) {
      this[key] = this._osc[key];
    }

    this._osc.to(this);
  }

  get type() {
    return this._osc.type;
  }

  set type(value) {
    this._osc.type = value;
  }

  start(at = 0, dur = 0) {
    this._osc.start(this.context.currentTime + at);

    dur && this.stop(at + dur);
  }

  stop(at = 0) {
    this._osc.stop(this.context.currentTime + at);
  }
}
