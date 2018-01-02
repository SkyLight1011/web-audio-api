import {FxPlugin} from '../../../fx-plugin.js';

export class DelayFX extends FxPlugin {
  constructor(...args) {
    super(...args);
  }

  static get id() {
    return 'delay';
  }

  get defaults() {
    return Object.assign({}, super.defaults, {
      delay: {
        name: 'Delay',
        unit: 's',
        min: 0,
        max: 5,
        step: 0.05,
        default: 0.25,
        callback: (value, at, type) => this._setParamValue(this._delay.delayTime, value, at, type)
      },
      feedback: {
        name: 'Feedback',
        min: 0,
        max: 1,
        step: 0.01,
        default: 0.5,
        callback: (value, at, type) => this._setParamValue(this._feedback.gain, value, at, type)
      },
      cutoff: {
        name: 'Cut-off',
        min: 20,
        max: 2e4,
        default: 2500,
        exponential: true,
        callback: (value, at, type) => this._setParamValue(this._filter.frequency, value, at, type)
      },
      bounce: {
        name: 'Bounce',
        boolean: true,
        default: false
      }
    });
  }

  setup() {
    super.setup();

    this._delay = this.context.createDelay();
    this._feedback = this.context.createGain();
    this._filter = this.context.createBiquadFilter();

    this._fx
      .to(this._delay)
      .to(this._filter)
      .to(this._feedback)
      .to(this._delay, this._output);
  }
}
