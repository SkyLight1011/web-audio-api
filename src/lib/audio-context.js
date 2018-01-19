import applyOverrides from './overrides.js';

import {GeneratorNode} from './generator.js';

export class TestAudioContext extends AudioContext {
  constructor() {
    super();

    applyOverrides(this);
  }

  createGenerator(preset) {
    return new GeneratorNode(this, preset);
  }
}
