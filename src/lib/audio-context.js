import './overrides.js';

import {GeneratorNode} from './generator.js';
import {EnvelopeNode} from './envelope.js';
import {VoiceNode} from './voice.js';
import {InstrumentNode} from './instrument.js';
import {MixerNode} from './mixer.js';
import {ReverbNode} from './reverb.js';
import {FeedbackDelayNode} from './feedback-delay.js';
import {SequencerNode} from './sequencer.js';

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

  createVoice(note, preset) {
    return new VoiceNode(this, note, preset);
  }

  createInstrument(preset) {
    return new InstrumentNode(this, preset);
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
}
