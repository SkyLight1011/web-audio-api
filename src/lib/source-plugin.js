import {Plugin} from './plugin.js';
import {Voice} from './source-plugin-voice.js';

const WAVE_TYPES = ['sine', 'triangle', 'sawtooth', 'square'];

export class SourcePlugin extends Plugin {
  constructor(...args) {
    super(...args);
  }

  static get id() {
    return 'source';
  }

  get defaults() {
    return Object.assign({}, super.defaults, {
      gainEnv: {
        name: 'Gain envelope',
        boolean: true,
        default: false
      },
      gainEnvAttack: {
        name: 'Att',
        unit: 's',
        min: 0.001,
        max: 5,
        default: 0.005
      },
      gainEnvDecay: {
        name: 'Dec',
        unit: 's',
        min: 0.001,
        max: 5,
        default: 0.04
      },
      gainEnvSustain: {
        name: 'Sus',
        min: 0,
        max: 1,
        step: 0.01,
        default: 0.25
      },
      gainEnvRelease: {
        name: 'Rel',
        unit: 's',
        min: 0.001,
        max: 10,
        default: 0.2
      },

      gainLFO: {
        name: 'Gain LFO',
        min: 0,
        max: 1,
        default: 0
      },
      gainLFOType: {
        name: 'Type',
        values: WAVE_TYPES,
        default: 'sine'
      },
      gainLFODelay: {
        name: 'Delay',
        min: 0,
        max: 5,
        default: 0.5
      },
      gainLFOSpeed: {
        name: 'Speed',
        unit: 'Hz',
        min: 0,
        max: 50,
        default: 5
      },

      filterEnv: {
        name: 'Filter envelope',
        boolean: true,
        default: false
      },
      filterEnvReverse: {
        name: 'Rev',
        boolean: true,
        default: false,
      },
      filterEnvAmount: {
        name: 'Amt',
        min: 0,
        max: 1,
        default: 0
      },
      filterEnvDelay: {
        name: 'Delay',
        unit: 's',
        min: 0,
        max: 5,
        default: 0
      },
      filterEnvAttack: {
        name: 'Att',
        unit: 's',
        min: 0.001,
        max: 5,
        default: 0
      },
      filterEnvDecay: {
        name: 'Dec',
        unit: 's',
        min: 0.001,
        max: 5,
        default: 0
      },
      filterEnvHold: {
        name: 'Hold',
        unit: 's',
        min: 0,
        max: 10,
        default: 0
      },
      filterEnvSustain: {
        name: 'Sus',
        min: 0,
        max: 1,
        step: 0.01,
        default: 1
      },
      filterEnvRelease: {
        name: 'Rel',
        unit: 's',
        min: 0.001,
        max: 10,
        default: 0
      },

      filterType: {
        name: 'Type',
        values: ['lowpass', 'highpass', 'lowshelf', 'highshelf'],
        default: 'highpass',
        callback: (value) => this._filter.type = value
      },
      filterCutoff: {
        name: 'Cutoff',
        unit: 'Hz',
        min: 20,
        max: 2e4,
        default: 20,
        exponential: true,
      },
      filterQ: {
        name: 'Q',
        min: 0,
        max: 40,
        default: 0,
      },
      filterGain: {
        name: 'Amp',
        min: -40,
        max: 40,
        default: 0,
      }
    });
  }

  setup() {
    super.setup();

    this._voices = {};
    this._mount = this.context.createGain();
    this._filter = this.context.createBiquadFilter();

    this._mount.to(this._filter).to(this._output);
  }

  bindParams() {
    super.bindParams();

    this.params.filterCutoff.to(this._filter.frequency);
    this.params.filterQ.to(this._filter.Q);
    this.params.filterGain.to(this._filter.gain);
  }

  play(note, at = 0, dur = 0) {
    !at && (at = this.context.currentTime);

    if (this._voices[note]) {
      this._voices[note].stop(at);
    }

    let voice = this._voices[note] = this.createVoice(note);

    voice.to(this._mount);
    voice.play(at);

    dur && this.stop(note, at + dur);
  }

  stop(note, at = 0) {
    let voice = this._voices[note];

    !at && (at = this.context.currentTime);

    if (voice) {
      voice.stop(at);
      voice.onended = () => voice.cut();
    }

    delete this._voices[note];
  }

  createVoice(note) {
    return new Voice(this, note);
  }
}
