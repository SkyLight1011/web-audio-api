export class SequencerAutomationTrackNode extends GainNode {
  constructor(ctx, params = [], points = [], bpm = 140, tpb = 4) {
    super(ctx);

    this._timer = null;
    this._playing = false;
    this._bpm = bpm;
    this._tpb = tpb;
    this._tpc = this._tpb * 4;
    this._interval = 60 / this._bpm / this._tpb;
    this._loop = false;

    for (let param of params) {
      if (!(param instanceof AudioParam)) {
        throw new Error('target should be of type AudioParam');
      }
    }

    this._params = params;
    this._points = points || [];
  }

  play(loop) {
    let t = this.context.currentTime;

    this._playing = true;

    for (let param of this._params) {
      for (let [type, value, pos, dur] of this._points) {
        pos = (t + (pos || 0)) * this._interval;

        switch (+type) {
          case 1:
            param.linearRampToValueAtTime(value, pos);
            break;
          case 2:
            param.exponentialRampToValueAtTime(value, pos);
            break;
          case 3:
            param.setTargetAtTime(value, pos, dur * this._interval);
            break;
          case 4:
            param.setValueCurveAtTime(value, pos, dur * this._interval);
            break;
          default:
            param.setValueAtTime(value, pos);
        }
      }
    }
  }

  stop() {
    this._playing = false;
    this._timer && cancelTimeout(this._timer);

    for (let param of this._params) {
      param.cancelScheduledValues(this.context.currentTime);
    }
  }
}
