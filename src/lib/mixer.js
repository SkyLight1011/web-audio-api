export class MixerNode extends GainNode {
  get [Symbol.toStringTag]() {
    return 'MixerNode';
  }

  constructor(ctx) {
    super(ctx);

    this._tracks = [];

    for (let i = 0; i++ < 24;) {
      let track = {
        instrument: null,
        fx: [this.context.createGain()],
        master: this.context.createGain()
      };

      track.fx[0]
        .to(track.master)
        .to(this);

      this._tracks.push(track);
    }
  }

  assignInstrument(instrument, trackNo = 1) {
    let track = this._tracks[trackNo - 1];

    if (track.instrument) {
      track.instrument.cut();
    }

    track.instrument = instrument;
    track.instrument.to(track.fx[0]);
  }

  addFx(fxNode, trackNo = 1) {
    let track = this._tracks[trackNo - 1];
    let lastFx = track.fx[track.fx.length - 1];

    lastFx.cut();
    lastFx.to(fxNode).to(track.master);

    track.fx.push(fxNode);
  }

  setVolume(volume, trackNo = 1) {
    this._tracks[trackNo - 1].master.gain.value = volume;
  }
}
