import {CommonPlugin} from './common-plugin.js';

export class FxPlugin extends CommonPlugin {
  constructor(ctx, preset = {}) {
    super(ctx, preset);

    this._input = this.context.createGain();
    this._output = this.context.createGain();
    this._fx = this.context.createGain();
    this._raw = this.context.createGain();

    this._fx.connect(this._output);
    this._input.connect(this._raw).connect(this._output);
  }

  get paramConfig() {
    return {
      vol: {
        title: 'Volume',
        callback: (value, time, type) => this._output.gain.set(value, time, type)
      },
      raw: {
        title: 'Raw',
        default: 0,
        callback: (value, time, type) => {
          this._raw.gain.set(value, time, type);
          this._fx.gain.set(1 - value, time, type);
        }
      },
      mute: {
        title: 'Mute',
        boolean: true,
        default: false,
        callback: (value, time) => this._output.gain.set(value ? 0 : this.get('vol'), time)
      }
    };
  }
}
