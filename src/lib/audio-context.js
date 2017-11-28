import './overrides.js';

import {GeneratorNode} from './generator.js';
import {EnvelopeNode} from './envelope.js';
import {VoiceNode} from './voice.js';
import {InstrumentNode} from './instrument.js';
import {MixerNode} from './mixer.js';
import {ReverbNode} from './reverb.js';
import {FeedbackDelayNode} from './feedback-delay.js';
import {SequencerNode} from './sequencer.js';
import {NoizeNode} from './noize.js';
import {DistortionNode} from './distortion.js';
import {ParametricEQNode} from './parametric-eq.js';
import {ChorusNode} from './chorus.js';
import {FlangerNode} from './flanger.js';

export class TestAudioContext extends AudioContext {
  constructor() {
    super();

    console.log('Custom audio context initialized');
  }

  createGenerator(preset) {
    return new GeneratorNode(this, preset);
  }

  createEnvelope(preset) {
    return new EnvelopeNode(this, preset);
  }

  createVoice(note, preset) {
    return new VoiceNode(this, note, preset);
  }

  createInstrument(config) {
    return new InstrumentNode(this, config);
  }

  createMixer() {
    return new MixerNode(this);
  }

  createReverb(seconds, options) {
    return new ReverbNode(this, seconds, options);
  }

  createFeedbackDelay(preset) {
    return new FeedbackDelayNode(this, preset);
  }

  createSequencer(mixer) {
    return new SequencerNode(this, mixer);
  }

  createNoize(type) {
    return new NoizeNode(this, type);
  }

  createDistortion(preset) {
    return new DistortionNode(this, preset);
  }

  createParametricEQ(preset) {
    return new ParametricEQNode(this, preset);
  }

  createChorus(preset) {
    return new ChorusNode(this, preset);
  }

  createFlanger(preset) {
    return new FlangerNode(this, preset);
  }
}
