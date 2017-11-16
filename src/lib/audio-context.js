import {GeneratorNode} from './generator.js';
import {EnvelopeNode} from './envelope.js';

export class TestAudioContext extends AudioContext {
  constructor() {
    super();

    console.log('Custom audio context initialized');
  }

  createGenerator() {
    return new GeneratorNode(this);
  }

  createEnvelope(preset) {
    return new EnvelopeNode(this, preset);
  }
}
