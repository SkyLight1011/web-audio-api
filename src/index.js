import {TestAudioContext} from './lib/audio-context.js';

const ctx = new TestAudioContext;

let active = {};
let octave = 4;
let keys = [65, 87, 83, 69, 68, 70, 82, 71, 84, 72, 89, 74];
let mixer = ctx.createMixer();
let instrument;
let eq = ctx.createBiquadFilter();

mixer.gain.value = 0.3;
mixer.to(ctx.destination);

eq.type = 'lowpass';
eq.frequency.value = 150;
eq.gain.value = 25;
mixer.addFx(eq, 1);

let comp = ctx.createDynamicsCompressor();
comp.threshold.value = -25;
comp.knee.value - 40;
comp.ratio.value = 12;
comp.attack.value = 0;
comp.release.value = 0.25;
mixer.addFx(comp, 1);

let seq = ctx.createSequencer(mixer);

seq.assignNote(1,
  [46, 0, 1], [46, 3, 1], [46, 6, 1],
  [41, 9, 1], [41, 12, 1], [41, 14, 1],
  [39, 16, 1], [39, 19, 1], [39, 22, 1],
  [39, 25, 1], [41, 28, 1], [44, 30, 1]
);
seq.assignNote(2,
  [67, 0, 1], [65, 3, 1], [60, 6, 1],
  [60, 10, 0.5], [60, 13, 1], [62, 16, 1],
  [63, 19, 1], [58, 22, 1], [56, 26, 1], [53, 29, 1]
);
seq.setVolume(0.5, 2);
mixer.addFx(ctx.createFeedbackDelay(), 2);

let eq2 = ctx.createBiquadFilter();
eq2.type = 'highpass';
eq2.frequency.value = 100;
eq2.gain.value = 25;
mixer.addFx(eq2, 3);

let instrumentConfigs = [
  {
    name: 'Bass',
    preset: {
      voice: {
        osc: [
          {
            type: 'square'
          },
          {
            type: 'square',
            detune: 1200
          },
          {
            type: 'square',
            detune: 700
          }
        ],
        env: {
          attack: 0.01,
          decay: 0,
          sustain: 1,
          release: 0.2
        }
      }
    }
  },
  {
    name: 'Power saw',
    preset: {
      voice: {
        osc: [
          {
            type: 'triangle'
          },
          {
            type: 'sawtooth',
            detune: 700,
            gain: 0.3
          },
          {
            type: 'sine',
            detune: 700
          }
        ],
        noize: {
          type: 'pink',
          gain: 0.3
        },
        env: {
          attack: 0.01,
          decay: 0.2,
          sustain: 1,
          release: 0.2
        }
      }
    }
  },
  {
    name: 'Another lead',
    preset: {
      voice: {
        gain: 0.1,
        osc: [
          {type: 'sine', detune: 2400},
          {type: 'triangle', detune: 2400},
          {type: 'triangle', detune: 2100}
        ],
        env: {
          attack: 0.3,
          decay: 2,
          sustain: 0.5,
          release: 0.5
        }
      }
    }
  },
  {
    name: 'Distorted',
    preset: {
      voice: {
        osc: [
          {type: 'sine'},
          {type: 'triangle'},
          {type: 'sawtooth'},
        ],
        env: {
          attack: 0.02,
          decay: 0,
          sustain: 1,
          release: 0.5
        }
      }
    }
  }
];
let instruments = instrumentConfigs.map(config => ctx.createInstrument(config));
let instrumentsContainer = document.querySelector('#instrumentsContainer');
let selectedInstrument;

mixer.addFx(ctx.createDistortion(), 4);

instruments.forEach((instrument, i) => {
  seq.assignInstrument(instrument, i + 1);

  let btn = document.createElement('button');
  btn.dataset.instrumentNo = i;
  btn.innerText = instrument.name || `Instrument ${i + 1}`;
  btn.onclick = e => selectedInstrument = instrument;

  instrumentsContainer.appendChild(btn);
});

selectedInstrument = instruments[0];

console.log('sequencer', seq);

document.querySelector('#runGenerator').addEventListener('click', e => {
  let generator = ctx.createGenerator();

  generator.type = 'triangle';
  generator.frequency.value = 100;
  generator.gain.value = 0.5;

  generator.start(0, 1);
  generator.to(ctx.destination);
});

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
