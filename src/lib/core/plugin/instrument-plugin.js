import {SourcePlugin} from './source-plugin.js';
import {InstrumentVoice} from './instrument-voice.js';

export class InstrumentPlugin extends SourcePlugin {
  constructor(ctx, preset = {}) {
    super(ctx, preset);

    this.setVoice(InstrumentVoice);
    this._voices = {};
  }

  get paramConfig() {
    return Object.assign({}, super.paramConfig, {
      osc1Type: {
        title: 'Wave',
        options: ['sine', 'triangle', 'sawtooth', 'square'],
        default: 'sine'
      },
      osc1Detune: {
        title: 'Detune',
        min: -3600,
        max: 3600,
        step: 100,
        default: 0,
        unit: 'cents'
      },
      osc1Vol: {
        title: 'Vol'
      },
      mono: {
        title: 'Mono',
        boolean: true
      },
      porta: {
        title: 'Portamento',
        default: 0,
        unit: 'sec'
      }
    });
  }

  play(note, at = 0, dur = 0) {
    let voice;

    if (!this.get('mono') || this._voices.length) {
      voice = this._voices.values()[0];
      voice.rampToNote(note, at, this.get('porta'));
    } else {
      if (!this.get('mono') && this._voices[note]) {
        this._voices[note].stop();
      }

      voice = new this.Voice(this.context, this);
      voice.setNote(note);
      voice.play(at, dur);

      this._voices[note] = voice;
    }
  }

  stop(note, at = 0) {
    if (!this._voices[note]) {
      return;
    }

    this._voices[note].stop(at);
  }

  setVoice(Voice) {
    this.Voice = Voice;
  }
}
