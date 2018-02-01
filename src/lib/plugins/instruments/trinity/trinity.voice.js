import {Voice} from '../../../source-plugin-voice.js';

export class TrinityVoice extends Voice {
  constructor(...args) {
    let numEnded = 0;

    super(...args);

    this._osc = [];

    for (let i = 0; i < 3; i++) {
      let type = this._plugin.get(`osc${i + 1}Type`);
      let isNoize = ['pink', 'white'].indexOf(type) > -1;

      if (!isNoize) {
        this._osc[i] = this.context.createGenerator({
          type,
          frequency: this.frequency,
        });

        this._plugin.params[`osc${i + 1}CoarseDetune`].to(this._osc[i].frequency, true);
        this._plugin.params[`osc${i + 1}Detune`].to(this._osc[i].detune, true);
      } else {
        this._osc[i] = this.context.createNoize(type);
      }

      this._plugin.params[`osc${i + 1}Gain`].to(this._osc[i].gain);

      let target = (i === 2 && this._plugin.get('osc3lfo'))
        ? this._osc[0].gain
        : this._mount;
      this._osc[i].to(target);

      this._osc[i].onended = () => {
        if (++numEnded === this._osc.length) {
          this.onended();
        }
      }
    }
  }

  play(at = 0, dur = 0) {
    for (let osc of this._osc) {
      osc.start(at, dur);
    }

    super.play(at, dur);
  }

  stop(at = 0, force) {
    let minDur = force || this._plugin.get('gainEnv.release') || 0;

    for (let osc of this._osc) {
      osc.gain.set(0, at + minDur + 0.01, 1);
      osc.stop(at + minDur + 0.01);
    }

    super.stop(at);
  }
}
