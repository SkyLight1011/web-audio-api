export class SequencerNode extends GainNode {
  get [Symbol.toStringTag]() {
    return 'SequencerNode';
  }

  constructor(ctx, mixer) {
    super(ctx);

    this._mixer = mixer;
    this._tracks = [];
  }

  assignInstrument(instrument, trackNo = 1) {
    let track = this._tracks[trackNo - 1];

    if (track) {
      track.instrument.cut(track.master);
    } else {
      track = {
        instrument: null,
        master: this.context.createGain(),
        notes: []
      };

      this._tracks.push(track);
    }

    track.instrument = instrument;
    instrument.to(track.master);
    this._mixer.assignInstrument(track.master, trackNo);
  }

  assignNote(trackNo, ...notes) {
    let track = this._tracks[trackNo - 1];

    if (!track) {
      return;
    }

    track.notes = track.notes.concat(notes);
  }

  play(trackNo) {
    let tracks = this._tracks;

    if (trackNo) {
      tracks = [tracks[trackNo - 1]];
    }

    for (let {instrument, notes} of tracks) {
      for (let note of notes) {
        instrument.play(...note);
      }
    }
  }
}
