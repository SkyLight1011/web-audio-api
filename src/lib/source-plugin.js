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
        enabled: {
          name: 'Gain LFO',
          boolean: true,
          default: false
        },
        attack: {
          name: 'Att',
          unit: 's',
          min: 0.001,
          max: 5,
          default: 0.005
        },
        decay: {
          name: 'Dec',
          unit: 's',
          min: 0.001,
          max: 5,
          default: 0.04
        },
        sustain: {
          name: 'Sus',
          min: 0,
          max: 1,
          step: 0.01,
          default: 0.25
        },
        release: {
          name: 'Rel',
          unit: 's',
          min: 0.001,
          max: 10,
          default: 0.2
        }
      },

      gainLFO: {
        delay: {
          name: 'Delay',
          min: 0,
          max: 5,
          default: 0
        },
        attack: {
          name: 'Attack',
          min: 0,
          max: 5,
          default: 0
        },
        type: {
          name: 'Type',
          values: WAVE_TYPES,
          default: 'sine'
        },
        amount: {
          name: 'Amount',
          min: 0,
          max: 1,
          default: 0
        },
        speed: {
          name: 'Speed',
          unit: 'Hz',
          min: 0,
          max: 50,
          default: 5
        }
      },

      filterEnv: {
        enabled: {
          name: 'Filter envelope',
          boolean: true,
          default: false
        },
        reverse: {
          name: 'Rev',
          boolean: true,
          default: false,
        },
        amount: {
          name: 'Amt',
          min: 0,
          max: 1,
          default: 0
        },
        delay: {
          name: 'Delay',
          unit: 's',
          min: 0,
          max: 5,
          default: 0
        },
        attack: {
          name: 'Att',
          unit: 's',
          min: 0.001,
          max: 5,
          default: 0
        },
        hold: {
          name: 'Hold',
          unit: 's',
          min: 0,
          max: 10,
          default: 0
        },
        decay: {
          name: 'Dec',
          unit: 's',
          min: 0.001,
          max: 5,
          default: 0
        },
        sustain: {
          name: 'Sus',
          min: 0,
          max: 1,
          step: 0.01,
          default: 1
        },
        release: {
          name: 'Rel',
          unit: 's',
          min: 0.001,
          max: 10,
          default: 0
        }
      },

      filterType: {
        name: 'Type',
        values: ['lowpass', 'highpass', 'lowshelf', 'highshelf'],
        default: 'highpass',
        bindings: [[this._filter, 'type']]
      },
      filterCutoff: {
        name: 'Cutoff',
        unit: 'Hz',
        min: 20,
        max: 2e4,
        default: 20,
        exponential: true,
        bindings: [this._filter.frequency]
      },
      filterQ: {
        name: 'Q',
        min: 0,
        max: 40,
        default: 0,
        bindings: [this._filter.Q]
      },
      filterGain: {
        name: 'Amp',
        min: -40,
        max: 40,
        default: 0,
        bindings: [this._filter.gain]
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
