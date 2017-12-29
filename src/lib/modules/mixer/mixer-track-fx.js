export class MixerTrackFXList {
  constructor(ctx) {
    this.context = ctx;

    this._fx = [];
    this._input = this.context.createGain();
    this._output = this.context.createGain();

    this._input.to(this._output);
  }

  add(fx) {
    let prevLast = this._fx.length > 0 ? this._fx[this._fx.length - 1] : this._input;

    if (prevLast) {
      prevLast.cut(this._output);
      prevLast.to(fx);
    }

    this._fx.push(fx);

    fx.to(this._output);
  }

  remove() {}

  to(...targets) {
    return this._output.to(...targets);
  }
}
