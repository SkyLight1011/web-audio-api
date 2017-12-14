import {CommonPlugin} from './common-plugin.js';

export class SourcePlugin extends CommonPlugin {
  constructor(ctx, preset = {}) {
    super(ctx, preset);

    this._mount = this.context.createGain();
    this._filter = this.context.createBiquadFilter();

    this._mount.connect(this._filter).connect(this._output);
  }

  get paramConfig() {
    return {
      vol: {
        title: 'Volume',
        callback: (value, time, type) => this._output.gain.set(value, time, type)
      },
      filterType: {
        title: 'Filter',
        options: ['lowpass', 'highpass'],
        callback: value => this._filter.type = value
      },
      filterCutoff: {
        title: 'Cutoff',
        min: 20,
        max: 2e4,
        default: 1000,
        exponential: true,
        unit: 'Hz',
        callback: (value, time, type) => this._filter.frequency.set(value, time, type)
      },
      filterQ: {
        title: 'Q',
        min: 0,
        max: 40,
        default: 0,
        callback: (value, time, type) => this._filter.Q.set(value, time, type)
      },
      filterAmp: {
        title: 'Amp',
        min: -40,
        max: 40,
        callback: (value, time, type) => this._filter.gain.set(value, time, type)
      }
    };
  }
}
