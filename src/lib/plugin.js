import {Module} from './module.js';

export class Plugin extends Module {
  constructor(...args) {
    super(...args);
  }

  static get id() {
    return 'plugin';
  }
}
