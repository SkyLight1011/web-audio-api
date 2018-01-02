import {Plugin} from './plugin.js';
import {Voice} from './source-plugin-voice.js';

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
        min: 0,
        max: 5,
        default: 0.005
      },
      gainEnvDecay: {
        name: 'Dec',
        unit: 's',
        min: 0,
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
        min: 0,
        max: 10,
        default: 0.2
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
      filterEnvAttack: {
        name: 'Att',
        unit: 's',
        min: 0,
        max: 5,
        default: 0
      },
      filterEnvDecay: {
        name: 'Dec',
        unit: 's',
        min: 0,
        max: 5,
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
        min: 0,
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
        callback: (value, at, type) => this._setParamValue(this._filter.frequency, value, at, type)
      },
      filterQ: {
        name: 'Q',
        min: 0,
        max: 40,
        default: 0,
        callback: (value, at, type) => this._setParamValue(this._filter.Q, value, at, type)
      },
      filterGain: {
        name: 'Amp',
        min: -40,
        max: 40,
        default: 0,
        callback: (value, at, type) => this._setParamValue(this._filter.gain, value, at, type)
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
      this._voices[note].stop(at, true);
    }

    let voice = this._voices[note] = this.createVoice(note);

    voice.to(this._mount);
    voice.play(at, dur);
  }

  stop(note, at = 0) {
    if (!note) {
      for (let note in this._voices) {
        this.stop(note);
      }

      return;
    }

    if (this._voices[note]) {
      this._voices[note].stop(at);

      this._voices[note].onended = () => {
        console.log(`Voice ${note} ended`);
        this._voices[note] && this._voices[note].cut();
        delete this._voices[note];
      };
    }
  }

  createVoice(note) {
    return new Voice(this, note);
  }
}
