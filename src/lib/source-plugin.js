import {Plugin} from './plugin.js';
import {Voice} from './source-plugin-voice.js';

export class SourcePlugin extends Plugin {
  constructor(ctx, preset = {}) {
    super(ctx, preset);

    this._voices = {};
    this._filter = this.context.createBiquadFilter();

    this._mount.cut();
    this._mount.to(this._filter).to(this._output);
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
        default: 2500,
        exponential: true,
        callback: (value, at, type) => this._filter.frequency.set(value, at, type)
      },
      filterQ: {
        name: 'Q',
        min: 0,
        max: 40,
        default: 0,
        callback: (value, at, type) => this._filter.Q.set(value, at, type)
      },
      filterGain: {
        name: 'Amp',
        min: -40,
        max: 40,
        default: 0,
        callback: (value, at, type) => this._filter.gain.set(value, at, type)
      }
    });
  }

  play(note, at = 0, dur = 0) {
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
        this._voices[note] && this._voices[note].cut();
        delete this._voices[note];
      };
    }
  }

  createVoice(note) {
    return new Voice(this, note);
  }
}
