import {Module} from '../../module.js';
import {MixerTrackFXList} from './mixer-track-fx.js';

export class MixerTrack extends Module {
  constructor(mixer) {
    super(mixer.context);

    this._mixer = mixer;
  }

  get defaults() {
    return {
      vol: {
        name: 'Vol',
        min: 0,
        max: 1,
        step: 0.01,
        default: 1,
        callback: (value, at, type) => this._output.gain.set(value, at, type)
      },
      pan: {
        name: 'Pan',
        min: -1,
        max: 1,
        step: 0.01,
        default: 0,
        callback: (value, at, type) => this._panner.pan.set(value, at,type)
      }
    }
  }

  setup() {
    super.setup();

    this._input;
    this._fx = new MixerTrackFXList(this.context);
    this._panner = this.context.createStereoPanner();
    this._output = this.context.createGain();

    this._fx
      .to(this._panner)
      .to(this._output);
  }

  assign(source) {
    if (this._input) {
      this._input.cut(this._fx._input);
    }

    this._input = source;
    this._input.to(this._fx._input);
  }

  addFx(fx) {
    this._fx.add(fx);
  }

  to(...targets) {
    return this._output.to(...targets);
  }
}
