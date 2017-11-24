export class SequencerTrackNode extends GainNode {
  get [Symbol.toStringTag]() {
    return 'SequencerTrackNode';
  }

  constructor(ctx, bpm = 140, tpb = 4) {
    super(ctx);

    this._playing = false;
    this._bpm = bpm;
    this._tpb = tpb;
    this._tpc = this._tpb * 4;
    this._interval = 60 / this._bpm / this._tpb;
    this._instrument = null;
    this._notes = [];
    this._loop = false;
    this._sequence = null;
  }

  get clipSize() {
    return Math.ceil(Math.ceil(this._notes.reduce((max, item) => Math.max(max, item[1]), 0)) / this._tpc) * this._tpc;
  }

  assignInstrument(instrument) {
    this._instrument && this._instrument.cut(this);

    this._instrument = instrument;

    this._instrument.to(this);
  }

  setNote(...notes) {
    this._notes = this._notes.concat(notes);
  }

  play(loop) {
    this.stop();

    this._sequence = this._buildSequence();
    this._loop = !!loop;
    this._playing = true;
    this._startTime = this.context.currentTime;

    this._playNext();
  }

  stop() {
    if (this._playing && this._timer) {
      clearTimeout(this._timer);

      this._instrument.stop();
    }

    this._playing = false;
  }

  _playNext() {
    let nextStep = this._sequence.shift();

    if (!nextStep) return;

    let currentTick = nextStep.tick;

    for (let [note, at, dur] of nextStep.notes) {
      this._instrument.play(note, at * this._interval + this._startTime, dur * this._interval);
    }

    if (this._loop) {
      nextStep.tick += this.clipSize;

      for (let note of nextStep.notes) {
        note[1] += this.clipSize;
      }

      this._sequence.push(nextStep);
    }

    nextStep = this._sequence[0];
    let timeout = Math.floor((nextStep.tick - currentTick) * this._interval * 1000) - 50;

    this._timer = setTimeout(this._playNext.bind(this), timeout);
  }

  _buildSequence() {
    return this._notes.reduce((res, note) => {
      let tick = Math.floor(note[1]);

      res[tick] || (res[tick] = {notes: [], tick});
      res[tick].notes.push(Array.from(note));

      return res;
    }, []).filter(item => !!item.notes.length);
  }
}
