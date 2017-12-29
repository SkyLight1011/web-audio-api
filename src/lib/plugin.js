import {Module} from './module.js';

export class Plugin extends Module {
  constructor(...args) {
    super(...args);
  }

  static get id() {
    return 'plugin';
  }

  get defaults() {
    return {
      master: {
        name: 'Master',
        min: 0,
        max: 1,
        step: 0.01,
        default: 1,
        callback: (value, at, type) => this._output.gain.set(value, at, type)
      },
      mute: {
        name: 'Mute',
        boolean: true,
        default: false,
        callback: (mute) => this._output.gain.set(mute ? 0 : this.get('master'))
      }
    }
  }

  setup() {
    this._mount = this.context.createGain();
    this._output = this.context.createGain();
  }

  to(target) {
    return this._output.to(target);
  }

  cut(target) {
    this._output.cut(target);
  }
}
