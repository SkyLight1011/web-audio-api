import {InstrumentPlugin} from '../../../instrument-plugin.js';
import {TrinityVoice} from './trinity.voice.js';
import presets from './trinity.presets.js';

const WAVE_TYPES = ['sine', 'triangle', 'sawtooth', 'square', 'pink', 'white'];

export class TrinityInstrument extends InstrumentPlugin {
  constructor(...args) {
    super(...args);
  }

  static get id() {
    return 'trinity';
  }

  get defaults() {
    return Object.assign({}, super.defaults, {
      osc1Type: {
        name: 'Type',
        values: WAVE_TYPES,
        default: 'sine'
      },
      osc1Detune: {
        name: 'Detune',
        unit: 'cents',
        min: -2400,
        max: 2400,
        step: 100,
        default: 0
      },
      osc1CoarseDetune: {
        name: 'CD',
        unit: '',
        min: 0.9,
        max: 1.1,
        step: 0.01,
        default: 1
      },
      osc1Gain: {
        name: 'Gain',
        min: 0,
        max: 1,
        step: 0.01,
        default: 1
      },
      osc2Type: {
        name: 'Type',
        values: WAVE_TYPES,
        default: 'sine'
      },
      osc2Detune: {
        name: 'Detune',
        unit: 'cents',
        min: -2400,
        max: 2400,
        step: 100,
        default: 0
      },
      osc2CoarseDetune: {
        name: 'CD',
        unit: '',
        min: 0.9,
        max: 1.1,
        step: 0.01,
        default: 1
      },
      osc2Gain: {
        name: 'Gain',
        min: 0,
        max: 1,
        step: 0.01,
        default: 1
      },
      osc3Type: {
        name: 'Type',
        values: WAVE_TYPES,
        default: 'sine'
      },
      osc3Detune: {
        name: 'Detune',
        unit: 'cents',
        min: -2400,
        max: 2400,
        step: 100,
        default: 0
      },
      osc3CoarseDetune: {
        name: 'CD',
        unit: '',
        min: 0.9,
        max: 1.1,
        step: 0.01,
        default: 1
      },
      osc3Gain: {
        name: 'Gain',
        min: 0,
        max: 1,
        step: 0.01,
        default: 1
      },
      osc3lfo: {
        name: 'OSC3 as LFO',
        description: 'Set OSC3 as AM LFO for OSC1',
        boolean: true,
        default: false
      }
    });
  }

  get presets() {
    return presets;
  }

  createVoice(note) {
    return new TrinityVoice(this, note);
  }
}
