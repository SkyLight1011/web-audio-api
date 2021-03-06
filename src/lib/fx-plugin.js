import {Plugin} from './plugin.js';

export class FxPlugin extends Plugin {
  constructor(...args) {
    super(...args);
  }

  static get id() {
    return 'fx';
  }

  get defaults() {
    return Object.assign({}, super.defaults, {
      raw: {
        name: 'Raw',
        min: 0,
        max: 1,
        step: 0.01,
        default: 1,
      },
      pass: {
        name: 'Pass through',
        boolean: true,
        default: false,
        callback: (value) => this._fx.mute(value)
      }
    });
  }

  setup() {
    super.setup();

    this._input = this.context.createGain();
    this._raw = this.context.createGain();
    this._fx = this.context.createGain();

    this._input.to(this._raw, this._fx).to(this._output);
  }

  bindParams() {
    super.bindParams();

    this.params.raw.to(this._raw.gain);
  }
}
