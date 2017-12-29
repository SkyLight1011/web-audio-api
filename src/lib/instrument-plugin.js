import {SourcePlugin} from './source-plugin.js';

export class InstrumentPlugin extends SourcePlugin {
  constructor(ctx, preset = {}) {
    super(ctx, preset);
  }

  static get id() {
    return 'instrument';
  }
}
