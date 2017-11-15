import {GeneratorNode} from './generator.js';

export class TestAudioContext extends AudioContext {
  constructor() {
    super();

    console.log('Custom audio context initialized');
  }

  createGenerator() {
    return new GeneratorNode(this);
  }
}
