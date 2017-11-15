import {TestAudioContext} from './lib/audio-context.js';

const ctx = new TestAudioContext;
const masterVol = ctx.createGain();

const controls = {};

let osc;
let playing = false;

for (let label of document.querySelectorAll('label')) {
  let id = label.getAttribute('for');

  controls[id] = {
    label,
    control: document.querySelector('#' + id)
  };
}

masterVol.connect(ctx.destination);

function makeSound() {
  playing && stopSound();

  osc = ctx.createOscillator();

  masterVol.gain.value = controls.master.control.value;
  osc.type = controls.type.control.value;
  osc.frequency.value = controls.frequency.control.value;
  osc.detune.value = controls.detune.control.value;

  osc.connect(masterVol);
  osc.start();
}

function stopSound() {
  osc.stop();
  osc.disconnect(masterVol);

  osc = null;
}

for (let key in controls) {
  controls[key].control.addEventListener(controls[key].control.tagName === 'SELECT' ? 'change' : 'input', e => {
    controls[key].label.innerText = e.target.value;
  });

  controls[key].label.innerText = controls[key].control.value;
}

document.addEventListener('keydown', e => {
  if (e.code.toLowerCase() !== 'space' || playing) {
    return;
  }

  makeSound();

  playing = true;
});

document.addEventListener('keyup', e => {
  if (!playing) {
    return;
  }

  stopSound();

  playing = false;
});
