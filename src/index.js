import {TestAudioContext} from './lib/audio-context.js';

const ctx = new TestAudioContext;

document.querySelector('#runGenerator').addEventListener('click', e => {
  let generator = ctx.createGenerator();

  generator.type = 'triangle';
  generator.frequency.value = 100;
  generator.gain.value = 0.1;

  generator.start(0, 1);
  generator.connect(ctx.destination);
});
