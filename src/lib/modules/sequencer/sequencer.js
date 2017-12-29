import {Module} from '../../module.js';
import {SequencerTrack} from './sequencer-track.js';

export class Sequencer extends Module {
  constructor(daw) {
    super(daw.context);

    this.daw = daw;
    this._tracks = [];
  }

  assign(source, trackNo) {
    this._getTrack(--trackNo).assign(source);
  }

  play() {}

  stop() {}

  _getTrack(trackNo) {
    let track = this._tracks[trackNo];

    if (!track) {
      track = new SequencerTrack(this);

      this._tracks.push(track);
    }

    return track;
  }
}
