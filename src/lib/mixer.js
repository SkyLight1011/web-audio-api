export class MixerNode extends GainNode {
  get [Symbol.toStringTag]() {
    return 'MixerNode';
  }

  constructor(ctx) {
    super(ctx);

    this._tracks = [];
  }

  getTrack(trackNo = 1, create) {
    let track = this._tracks[trackNo - 1];

    if (!track && create) {
      track = {
        instrument: null,
        fx: [this.context.createGain()],
        master: this.context.createGain()
      };

      track.fx[0]
        .to(track.master)
        .to(this);

      this._tracks.push(track);
    }

    return track;
  }

  assignInstrument(instrument, trackNo = 1) {
    let track = this.getTrack(trackNo, true);

    if (track.instrument) {
      track.instrument.cut();
    }

    track.instrument = instrument;
    track.instrument.to(track.fx[0]);
  }

  addFx(fxNode, trackNo = 1) {
    let track = this.getTrack(trackNo, true);
    let lastFx = track.fx[track.fx.length - 1];

    lastFx.cut();
    lastFx.to(fxNode).to(track.master);

    track.fx.push(fxNode);
  }

  setVolume(volume, trackNo = 1) {
    this.getTrack(trackNo, true).master.gain.value = volume;
  }
}
