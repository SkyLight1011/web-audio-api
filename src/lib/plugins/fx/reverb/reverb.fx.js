import {FxPlugin} from '../../../fx-plugin.js';

export class ReverbFX extends FxPlugin {
  constructor(...args) {
    super(...args);
  }

  static get id() {
    return 'reverb';
  }

  get defaults() {
    return Object.assign({}, super.defaults, {
      decay: {
        name: 'Decay',
        min: 0,
        max: 40,
        step: 0.1,
        default: 2,
        callback: () => this.refreshBuffer()
      },
      reverse: {
        name: 'Reverse',
        boolean: true,
        default: false,
        callback: () => this.refreshBuffer()
      },
      duration: {
        name: 'Dur',
        unit: 's',
        min: 0.5,
        max: 10,
        step: 0.1,
        default: 0.5,
        callback: () => this.refreshBuffer()
      },
      normalize: {
        name: 'Norm',
        boolean: true,
        default: true,
        callback: (value) => this._conv.normalize = value
      },
      amp: {
        name: 'Amp',
        min: 0,
        max: 5,
        step: 0.01,
        default: 1,
        callback: (value, at, time) => this._setParamValue(this._amp.gain, value, at, time)
      }
    });
  }

  setup() {
    super.setup();

    this._conv = this.context.createConvolver();
    this._amp = this.context.createGain();

    this.refreshBuffer();
    this._conv.normalize = this.get('normalize');
    this._amp.gain.value = this.get('amp');

    this._fx
      .to(this._conv)
      .to(this._amp)
      .to(this._output);
  }

  refreshBuffer() {
    this._conv.buffer = this._createBuffer(
      this.get('duration'),
      this.get('reverse'),
      this.get('decay')
    );
  }

  _createBuffer(dur, reverse, decay) {
    let sampleRate = this.context.sampleRate;
    let length = sampleRate * dur;
    let buffer = this.context.createBuffer(2, length, sampleRate);
    let channelData = [buffer.getChannelData(0), buffer.getChannelData(1)];

    for (let i = 0; i < length; i++) {
      let n = reverse ? length - i : i;

      channelData[0][i] = (Math.random() * 2 - 1) * Math.pow(1 - n / length, decay);
      channelData[1][i] = (Math.random() * 2 - 1) * Math.pow(1 - n / length, decay);
    }

    return buffer;
  }
}
