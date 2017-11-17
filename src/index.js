import {TestAudioContext} from './lib/audio-context.js';

const ctx = new TestAudioContext;

let active = {};
let octave = 4;
let keys = [65, 87, 83, 69, 68, 70, 82, 71, 84, 72, 89, 74];
let mixer = ctx.createMixer();
let instrument = ctx.createInstrument({
  voice: {
    osc: [
      {
        type: 'sawtooth'
      },
      {
        type: 'sawtooth',
        detune: -1700
      },
      {
        type: 'sawtooth',
        detune: -2400
      }
    ],
    env: {
      attack: 0,
      decay: 0,
      sustain: 1,
      release: 0
    }
  }
});
let eq = ctx.createBiquadFilter();
let rev = ctx.createReverb(0.5, {decay: 5});

mixer.gain.value = 0.1;
mixer.assignInstrument(instrument, 1);
mixer.to(ctx.destination);

mixer.addFx(rev, 1);

eq.type = 'lowshelf';
eq.frequency.value = 150;
eq.gain.value = 25;
mixer.addFx(eq, 1);

document.querySelector('#runGenerator').addEventListener('click', e => {
  let generator = ctx.createGenerator();

  generator.type = 'triangle';
  generator.frequency.value = 100;
  generator.gain.value = 0.1;

  generator.start(0, 1);
  generator.to(ctx.destination);
});

document.addEventListener('keydown', e => {
  let note = getNoteByKeyCode(e.keyCode);

  if (active[e.keyCode] || !note) {
    return;
  }

  console.log(`playing ${note}...`);
  console.log('instrument state', instrument);

  instrument.play(note);

  active[e.keyCode] = true;
});

document.addEventListener('keyup', e => {
  let note = getNoteByKeyCode(e.keyCode);

  if (!active[e.keyCode] || !note) {
    return;
  }

  console.log(`stopped ${note}`);

  instrument.stop(note);

  active[e.keyCode] = false;
});

function getNoteByKeyCode(keyCode) {
  return keys.includes(keyCode) ? octave * 12 + (keys.indexOf(keyCode) - 9) : null;
}
