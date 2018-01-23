import {Module} from './module.js';

export class Plugin extends Module {
  constructor(...args) {
    super(...args);
  }

  static get id() {
    return 'plugin';
  }

  get defaults() {
    return super.defaults;
  }

  setup() {
    super.setup();

    this._mount = this.context.createGain();
  }
}
