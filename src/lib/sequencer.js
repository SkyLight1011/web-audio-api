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

  play(loop = false, trackNo) {
    let tracks = this._tracks;

    if (trackNo) {
      tracks = [tracks[trackNo - 1]];
    }

    for (let track of tracks) {
      let notes = track.notes.map(note =>
        [
          note[0],
          note[1] * this._interval * this._unit,
          (note[2] || 0) * this._interval * this._unit
        ]);

      if (loop) {
        let sampleLength = 0;
        let blocks = 0;
        let loopNotes = notes;

        for (let note of notes) {
          sampleLength = Math.max(sampleLength, note[1]);
        }

        blocks = Math.ceil(sampleLength / (this._interval * this._tpb)) * 4;

        for (let i = 0; i++ < 10;) {
          loopNotes = loopNotes.concat(notes.map(note =>
            [
              note[0],
              note[1] + (this._interval * i * blocks),
              note[2]
            ]));
        }

        notes = loopNotes;
      }

      for (let note of notes) {
        track.instrument.play(...note);
      }
    }
  }

  stop(trackNo) {
    let tracks = this._tracks;

    if (trackNo) {
      tracks = [tracks[trackNo - 1]];
    }

    for (let {instrument} of tracks) {
      instrument.stop();
    }
  }
}
