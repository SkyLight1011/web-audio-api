import {Voice} from '../../source-plugin-voice.js';

export class TrinityVoice extends Voice {
  constructor(...args) {
    let numEnded = 0;

    super(...args);

    this._osc = [];

    for (let i = 0; i < 3; i++) {
      this._osc[i] = this.context.createGenerator({
        type: this._plugin.get(`osc${i + 1}Type`),
        frequency: this.frequency,
        detune: this._plugin.get(`osc${i + 1}Detune`),
        gain: this._plugin.get(`osc${i + 1}Gain`)
      });

      let target = (i === 2 && this._plugin.get('osc3lfo'))
        ? this._osc[0].gain
        : this._output;
      this._osc[i].to(target);

      this._osc[i].onended = () => {
        if (++numEnded === this._osc.length) {
          this.onended();
        }
      }
    }
  }

  play(at = 0, dur = 0) {
    console.log(this._osc);
    for (let osc of this._osc) {
      osc.start(at, dur);
    }
  }

  stop(at = 0, force) {
    for (let osc of this._osc) {
      osc.gain.linearRampToValueAtTime(0, at + 0.01);
      osc.stop(at + 0.01);
    }
  }
}
