export class MixerNode extends GainNode {
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
        .connect(track.master)
        .connect(this);

      this._tracks.push(track);
    }
  }

  assignInstrument(instrument, trackNo = 1) {
    let track = this._tracks[trackNo - 1];

    if (track.instrument) {
      track.instrument.disconnect();
    }

    track.instrument = instrument;
    track.instrument.connect(track.fx[0]);
  }

  addFx(fxNode, trackNo = 1) {
    let track = this._tracks[trackNo - 1];
    let lastFx = track.fx[track.fx.length - 1];

    lastFx.disconnect();
    lastFx.connect(fxNode).connect(track.master);

    track.fx.push(fxNode);
  }
}
