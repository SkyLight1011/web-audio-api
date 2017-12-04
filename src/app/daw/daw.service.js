import {TestAudioContext} from '../../lib/audio-context.js';
import presets from './presets.js';

const ctx = new TestAudioContext;

export class DAWService {
  constructor() {
    this.mixer = ctx.createMixer();
    this.sequencer = ctx.createSequencer(this.mixer);
  }

  createInstrument() {
    return ctx.createInstrument();
  }

  getPresets() {
    return presets;
  }
}
