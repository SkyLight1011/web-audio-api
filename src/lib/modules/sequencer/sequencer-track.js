import {Module} from '../../module.js';

export class SequencerTrack extends Module {
  constructor(seq) {
    super(seq.context);

    this.sequencer = seq;
  }

  get defaults() {
    return Object.assign({}, super.defaults, {
      pan: {
        name: 'Pan',
        min: -1,
        max: 1,
        default: 0,
        callback: (value, at, type) => this._setParamValue(this._panner.pan, value, at, type)
      }
    });
  }

  setup() {
    super.setup();

    this._source = null;
    this._input = this.context.createGain();
    this._panner = this.context.createStereoPanner();

    this._input
      .to(this._panner)
      .to(this._output);
  }

  assign(source) {
    this._source && this._source.cut();

    this._source = source;
    source.to(this._input);
  }

  assignToMixer(trackNo) {
    this.sequencer.daw.mixer.assign(this._source, trackNo);
  }
}
