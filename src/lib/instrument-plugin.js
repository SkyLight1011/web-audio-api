import {SourcePlugin} from './source-plugin.js';

export class InstrumentPlugin extends SourcePlugin {
  constructor(ctx, preset) {
    super(ctx, preset);

    this.applyPreset(preset || 0);
  }

  static get id() {
    return 'instrument';
  }

  get presets() {
    return [];
  }

  applyPreset(arg) {
    let preset;

    if (typeof arg === 'number') {
      preset = this.presets[arg];
    } else if (typeof arg === 'string') {
      preset = this.presets.find(item => item.id === arg);
    } else if (typeof arg === 'object') {
      preset = arg;
    }

    if (preset && preset.preset) {
      preset = preset.preset;
    }

    this.preset = preset;
  }
}
