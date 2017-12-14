import {CommonPlugin} from './common-plugin.js';

export class SourcePlugin extends CommonPlugin {
  constructor(ctx, preset = {}) {
    super(ctx, preset);

    this._mount = this.context.createGain();
  }

  get paramConfig() {
    return {
      vol: {
        title: 'Volume',
        callback: (value, time, type) => this._output.gain.set(value, time, type)
      }
    };
  }
}
