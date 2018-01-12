import {FxPlugin} from '../../../fx-plugin.js';

export class FlangerFX extends FxPlugin {
  constructor(...args) {
    super(...args);
  }

  static get id() {
    return 'flanger';
  }

  get defaults() {
    return Object.assign({}, super.defaults, {
      delay: {
        name: 'Delay',
        unit: 's',
        min: 0,
        max: 5,
        default: 0.005
      },
      depth: {
        name: 'Depth',
        min: 0,
        max: 1,
        default: 0.002
      },
      feedback: {
        name: 'Feedback',
        min: 0,
        max: 1,
        default: 0.5
      },
      speed: {
        name: 'Speed',
        min: 0,
        max: 5,
        default: 0.25
      }
    });
  }

  setup() {
    super.setup();

    this._osc = this.context.createGenerator({
      type: 'sine',
      frequency: this.get('speed'),
      gain: this.get('depth')
    });
    this._delay = this.context.createDelay();
    this._wet = this.context.createGain();
    this._feedback = this.context.createGain();

    this._setParamValue(this._delay.delayTime, this.get('delay'));
    this._setParamValue(this._feedback.gain, this.get('feedback'));

    this._osc.to(this._delay.delayTime);
    this._fx
      .to(this._wet, this._delay)
      .to(this._output);
    this._delay
      .to(this._feedback, this._wet)
      .to(this._fx);
  }
}
