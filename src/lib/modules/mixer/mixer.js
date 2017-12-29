import {Module} from '../../module.js';
import {MixerTrack} from './mixer-track.js';

export class Mixer extends Module {
  constructor(daw) {
    super(daw.context);

    this.daw = daw;
    this._tracks = [];
  }

  get defaults() {
    return {
      master: {
        name: 'Master',
        min: 0,
        max: 1,
        step: 0.01,
        default: 1,
        callback: (value, at, type) => this._output.gain.set(value, at, type)
      }
    };
  }

  setup() {
    this._output = this.context.createGain();
  }

  assign(source, trackNo) {
    let target = this._output;

    if (typeof trackNo !== 'undefined') {
      let track = this._getTrack(--trackNo);

      track.assign(source);
    }
  }

  addFx(name, trackNo) {
    this._getTrack(--trackNo).addFx(name);
  }

  to(...targets) {
    return this._output.to(...targets);
  }

  _getTrack(trackNo) {
    let track = this._tracks[trackNo];

    if (!track) {
      track = this._tracks[trackNo] = new MixerTrack(this);
      this._tracks[trackNo].to(this._output);
    }

    return track;
  }
}
