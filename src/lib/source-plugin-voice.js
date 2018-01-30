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

    if (this._plugin.get('filterEnv')) {
      this._gainEnv
        .to(this._filter)
        .to(this._output);
    } else {
      this._gainEnv
        .to(this._output);
    }

    /*this.addEnvelope(this._gainEnv.gain, {
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
    });*/

    if (this._plugin.get('gainLFO.amount')) {
      this.gainLFO = this.addLFO(this._velocity.gain, this._plugin._preset.gainLFO);

      this._plugin.get('gainLFO.type').bindTo([this.gainLFO, 'type']);
      this._plugin.get('gainLFO.amount').to(this.gainLFO.amount);
      this._plugin.get('gainLFO.speed').to(this.gainLFO.speed);
    }
  }

  get frequency() {
    return 440 * Math.pow(2, (this._note - 69) / 12);
  }

  addEnvelope(param, preset = {}) {
    this._env.push(new Envelope(this._plugin, param, preset));
  }

  addLFO(param, preset = {}) {
    let lfo = new LFO(this._plugin, param, preset);

    this._lfo.push(lfo);

    return lfo;
  }

  play(at = 0, dur = 0) {
    for (let env of this._env) {
      env.trigger(at);
    }

    for (let lfo of this._lfo) {
      lfo.start(at);
    }
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
