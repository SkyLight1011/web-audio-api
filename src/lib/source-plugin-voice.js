import {Module} from './module.js';
import {Envelope} from './source-plugin-envelope.js';

export class Voice extends Module {
  constructor(plugin, note) {
    super(plugin.context);

    this._plugin = plugin;
    this._note = note;
    this._mount = this.context.createGain();
    this._filter = this.context.createBiquadFilter();
    this._output = this.context.createGain();
    this._env = [];

    this._filter.type = 'lowpass';

    if (this._plugin.get('filterEnv')) {
      this._mount
        .to(this._filter)
        .to(this._output);
    } else {
      this._mount.to(this._output);
    }

    this.addEnvelope(this._mount.gain, {
      enabled: 'gainEnv',
      delay: 'gainEnvDelay',
      attack: 'gainEnvAttack',
      hold: 'gainEnvHold',
      decay: 'gainEnvDecay',
      sustain: 'gainEnvSustain',
      release: 'gainEnvRelease',
      amount: 'gainEnvAmount',
      min: 0,
      max: 1
    });
    this.addEnvelope(this._filter.frequency, {
      enabled: 'filterEnv',
      delay: 'filterEnvDelay',
      attack: 'filterEnvAttack',
      hold: 'filterEnvHold',
      decay: 'filterEnvDecay',
      sustain: 'filterEnvSustain',
      release: 'filterEnvRelease',
      amount: 'filterEnvAmount'
    });
  }

  get frequency() {
    return 440 * Math.pow(2, (this._note - 69) / 12);
  }

  addEnvelope(param, preset = {}) {
    this._env.push(new Envelope(this._plugin, param, preset));
  }

  play(at = 0, dur = 0) {
    for (let env of this._env) {
      env.trigger(at);
    }
  }

  stop(at = 0, force) {
    for (let env of this._env) {
      env.release(at);
    }
  }

  to(target) {
    return this._output.to(target);
  }

  cut(target) {
    this._output.cut(target);
  }

  onended() {}
}
