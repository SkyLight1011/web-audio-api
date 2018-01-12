import {TestAudioContext} from './lib/audio-context.js';

let active = {};
let octave = 4;
let keys = [65, 87, 83, 69, 68, 70, 82, 71, 84, 72, 89, 74];

import {DAW} from './lib/daw.js';
let daw = new DAW();

let selectedInstrument = daw.createInstrument('trinity');
let reverbFx = daw.createFx('reverb');
let flanger = daw.createFx('flanger');

selectedInstrument.applyPreset(2);

daw.mixer.assign(selectedInstrument, 1);
daw.mixer.addFx(reverbFx, 1);
//daw.mixer.addFx(flanger, 1);
daw.mixer.set('master', 0.3);

document.addEventListener('keydown', e => {
  let note = getNoteByKeyCode(e.keyCode);

  if (active[e.keyCode]) {
    return;
  }

  if (e.keyCode === 107) {
    octave++;
  } else if (e.keyCode === 109) {
    octave--;
  } else if (e.keyCode === 13) {
    seq.play(true);
  } else if (e.keyCode === 27) {
    seq.stop();
  } else if (e.key === '1') {
    seq.play(true, 1);
  } else if (e.key === '2') {
    seq.play(true, 2);
  }

  if (!note) {
    return;
  }

  console.log(`playing ${note}...`);
  console.log('instrument state', selectedInstrument);

  selectedInstrument.play(note);

  active[e.keyCode] = true;
});

document.addEventListener('keyup', e => {
  let note = getNoteByKeyCode(e.keyCode);

  if (!active[e.keyCode] || !note) {
    return;
  }

  console.log(`stopped ${note}`);

  selectedInstrument.stop(note);

  active[e.keyCode] = false;
});

function getNoteByKeyCode(keyCode) {
  return keys.includes(keyCode) ? octave * 12 + (keys.indexOf(keyCode) - 9) : null;
}
