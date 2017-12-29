import {Module} from '../../module.js';
import {MixerTrack} from './mixer-track.js';

export class Mixer extends Module {
  constructor(daw) {
    super(daw.context);

    this.daw = daw;
    this._tracks = [];
  }

  assign(source, trackNo) {
    source.cut();

    if (typeof trackNo !== 'undefined') {
      let track = this._getTrack(--trackNo);

      track.assign(source);
    } else {
      source.to(this._output);
    }
  }

  addFx(fx, trackNo) {
    this._getTrack(--trackNo).addFx(fx);
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
