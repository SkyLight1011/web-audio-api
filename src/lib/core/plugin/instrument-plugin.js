import {SourcePlugin} from './source-plugin.js';

export class InstrumentPlugin extends SourcePlugin {
  constructor(ctx, preset = {}) {
    super(ctx, preset);
  }

  get paramConfig() {
    return Object.assign({}, super.paramConfig, {});
  }

  play(note, at = 0, dur = 0) {}

  stop(at = 0) {}
}
