export class GeneratorNode extends GainNode {
  get [Symbol.toStringTag]() {
    return 'GeneratorNode';
  }

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
    !at && (at = this.context.currentTime);

    this._osc.start(at);

    dur && this.stop(at + dur);
  }

  stop(at = 0) {
    !at && (at = this.context.currentTime);

    this._osc.stop(at);
  }
}
