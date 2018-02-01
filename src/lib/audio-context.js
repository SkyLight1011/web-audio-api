import applyOverrides from './overrides.js';

import {GeneratorNode} from './generator.js';
import {CustomConstantSourceNode} from './constant-source-custom.js';
import {NoizeNode} from './noize.js';

export class TestAudioContext extends AudioContext {
  constructor() {
    super();

    applyOverrides(this);
  }

  createGenerator(preset) {
    return new GeneratorNode(this, preset);
  }

  createCustomConstantSource() {
    return new CustomConstantSourceNode(this);
  }

  createNoize(type) {
    return new NoizeNode(this, type);
  }
}
