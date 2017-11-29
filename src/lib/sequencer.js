import {SequencerTrackNode} from './sequencer-track.js';
import {SequencerAutomationTrackNode} from './sequencer-automation-track.js';

export class SequencerNode extends GainNode {
  get [Symbol.toStringTag]() {
    return 'SequencerNode';
  }

  constructor(ctx, mixer) {
    super(ctx);

    this._mixer = mixer;
    this._tracks = [];

    this.setBPM(140);
    this.setBeatUnit(1/4);
  }

  setBPM(bpm) {
    this._bpm = bpm;
    this._interval = 60 / this._bpm;
  }

  setBeatUnit(unit) {
    this._unit = unit;
    this._tpb = 1 / this._unit;
    this._beatInterval = this._interval / this._tpb;
  }

  assignInstrument(instrument, trackNo = 1) {
    let track = this.getTrack(trackNo, true);

    track.assignInstrument(instrument);
  }

  assignNote(trackNo = 1, ...notes) {
    let track = this.getTrack(trackNo, true);

    track.setNote(...notes);
  }

  getTrack(trackNo = 1, create) {
    let track = this._tracks[trackNo - 1];

    if (!track && create) {
      track = new SequencerTrackNode(this.context, this._bpm, this._tpb);
      this._mixer.assignInstrument(track, trackNo);

      this._tracks.push(track);
    }

    return track;
  }

  setVolume(volume, trackNo = 1) {
    this.getTrack(trackNo, true).gain.value = volume;
  }

  play(loop = false, trackNo) {
    let tracks = this._tracks;

    if (trackNo) {
      tracks = [tracks[trackNo - 1]];
    }

    for (let track of tracks) {
      track.play(loop);
    }
  }

  stop(trackNo) {
    let tracks = this._tracks;

    if (trackNo) {
      tracks = [tracks[trackNo - 1]];
    }

    for (let track of tracks) {
      track.stop();
    }
  }

  automate(params, points) {
    let track = new SequencerAutomationTrackNode(this.context, params, points, this._bpm, this._tpb);

    this._tracks.push(track);
  }
}
