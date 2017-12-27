import {Plugin} from './plugin.js';

export class FxPlugin extends Plugin {
  constructor(ctx, preset = {}) {
    super(ctx, preset);

    this._input = this.context.createGain();
  }
}
