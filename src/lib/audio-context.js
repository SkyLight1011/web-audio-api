import './overrides.js';

import {GeneratorNode} from './generator.js';

export class TestAudioContext extends AudioContext {
  constructor() {
    super();
  }

  createGenerator(preset) {
    return new GeneratorNode(this, preset);
  }
}
