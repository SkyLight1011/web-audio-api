import {Module} from './module.js';
import {Envelope} from './source-plugin-envelope.js';
import {LFO} from './source-plugin-lfo.js';

export class Voice extends Module {
  constructor(plugin, note) {
    super(plugin.context);

    this._plugin = plugin;
    this._note = note;
    this._mount = this.context.createGain();
    this._velocity = this.context.createGain();
    this._gainEnv = this.context.createGain();
    this._filter = this.context.createBiquadFilter();
    this._output = this.context.createGain();
    this._env = [];
    this._lfo = [];

    this._filter.type = 'lowpass';

    this._mount
      .to(this._velocity)
      .to(this._gainEnv);

    if (this._plugin.get('filterEnv.enabled')) {
      this._gainEnv
        .to(this._filter)
        .to(this._output);
    } else {
      this._gainEnv
        .to(this._output);
    }

    this.gainEnv = this.addEnvelope(this._gainEnv.gain, 'gainEnv', {
      min: 0,
      max: 1,
      amount: 1
    });
    this.filterEnv = this.addEnvelope(this._filter.frequency, 'filterEnv');

    if (this._plugin.get('gainLFO.amount')) {
      this.addLFO(this._velocity.gain, 'gainLFO');
    }
  }

  get frequency() {
    return 440 * Math.pow(2, (this._note - 69) / 12);
  }

  addEnvelope(param, envType, options = {}) {
    let paramGroup = this._plugin.params[envType];
    let env = new Envelope(this._plugin, param, {
      ...options,
      ...this._plugin._preset[envType]
    });

    this._env.push(env);

    for (let param in paramGroup) {
      paramGroup[param].bindTo([env.params, param]);
    }

    return env;
  }

  addLFO(param, lfoType) {
    let paramGroup = this._plugin.params[lfoType];
    let lfo = new LFO(this._plugin, param, this._plugin._preset[lfoType]);

    this._lfo.push(lfo);

    for (let param in paramGroup) {
      paramGroup[param].bindTo([lfo.params, param]);
    }

    return lfo;
  }

  play(at = 0, dur = 0) {
    for (let env of this._env) {
      env.trigger(at);
    }

    for (let lfo of this._lfo) {
      lfo.start(at);
    }
    console.log(this);
  }

  stop(at = 0) {
    for (let env of this._env) {
      env.release(at);
    }

    for (let lfo of this._lfo) {
      lfo.stop(at + 5);
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
