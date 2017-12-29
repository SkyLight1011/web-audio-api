import {TestAudioContext} from './lib/audio-context.js';

const ctx = new TestAudioContext;

let active = {};
let octave = 4;
let keys = [65, 87, 83, 69, 68, 70, 82, 71, 84, 72, 89, 74];
let mixer = ctx.createMixer();
let instrument;
let eq = ctx.createBiquadFilter();

mixer.gain.value = 0.5;
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

mixer.addFx(ctx.createFeedbackDelay({stereo: 0.5}), 2);
//mixer.addFx(ctx.createChorus(), 2);
mixer.setVolume(0.5, 2);

let eq2 = ctx.createBiquadFilter();
eq2.type = 'highpass';
eq2.frequency.value = 100;
eq2.gain.value = 25;
mixer.addFx(eq2, 3);

let instrumentConfigs = [
  {
    name: 'Bass',
    description: 'Simple square bass with lowpass filtering and compression',
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
  },
  {
    name: 'Power saw',
    description: 'Mixed (triangle/saw/sine) power lead with pink noize background and a feedback delay effect',
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
  },
  {
    name: 'Another lead',
    description: 'Simple (sine/2x triangle) lead with highpass filter',
    voice: {
      gain: 0.5,
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
      },
      lfo: {
        frequency: 20,
        amount: 0.2
      }
    }
  },
  {
    name: 'Distorted',
    description: 'Mixed (sine/triangle/saw) wave with distortion effect',
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
  },
  {
    name: 'Square pad',
    description: 'Pure 5x square wave pad with vibration',
    voice: {
      osc: [
        {type: 'square', detune: 2400},
        {type: 'square', detune: -2200},
        {type: 'square', detune: 2600},
        {type: 'square', detune: -1900},
        {type: 'square', detune: 2900}
      ],
      gain: 0.1,
      env: {
        attack: 0.02,
        decay: 0.7,
        sustain: 0,
        release: 0.5
      },
      lfo: {
        frequency: 10,
        amount: 0.15
      }
    }
  },
  {
    name: '6',
    description: '',
    voice: {
      osc: [
        {type: 'sine'},
        {type: 'sine', detune: -200},
        {type: 'sine', detune: 200},
        {type: 'sawtooth', detune: -500},
        {type: 'sawtooth', detune: 500}
      ],
      gain: 0.1,
      env: {
        attack: 0.01,
        decay: 0.1,
        sustain: 0,
        release: 0.5
      },
      cutoff: 100
    }
  }
];
let instrumentsContainer = document.querySelector('#instrumentsContainer');
let selectedInstrument;

mixer.addFx(ctx.createDistortion(), 4);

let instruments = instrumentConfigs.map((config, i) => {
  let instrument = ctx.createInstrument(config);

  seq.assignInstrument(instrument, i + 1);

  let btn = document.createElement('button');
  btn.dataset.instrumentNo = i;
  btn.innerText = instrument.name || `Instrument ${i + 1}`;
  btn.title = config.description;
  btn.onclick = e => selectedInstrument = instrument;

  instrumentsContainer.appendChild(btn);

  return instrument;
});

seq.automate([eq.frequency], [[1, 500, 16], [1, 100, 24], [1, 150, 31]]);

selectedInstrument = instruments[0];

console.log('sequencer', seq);

let peq = ctx.createParametricEQ();
let bandsEl = document.querySelector('.bands');

mixer.cut();
mixer.to(peq).to(ctx.destination);

for (let band of peq.bands) {
  let bandEl = document.createElement('div');

  bandEl.className = 'band';
  bandEl.innerHTML = `
  <span class="band-gain"></span>
  <input class="band-gain-input vertical" type="range" value="0" min="-25" max="25">
  <span class="band-frequency"></span>
  <input class="band-frequency-input vertical" type="range" value="0" min="0" max="100">
  `;

  let bandGainEl = bandEl.querySelector('.band-gain');
  let bandGainInputEl = bandEl.querySelector('.band-gain-input');
  let bandFrequencyEl = bandEl.querySelector('.band-frequency');
  let bandFrequencyInputEl = bandEl.querySelector('.band-frequency-input');

  bandGainEl.innerText = `${band.gain.value}db`;
  bandGainInputEl.value = band.gain.value;
  bandFrequencyEl.innerText = `${band.frequency.value}Hz`;
  bandFrequencyInputEl.value = (value => {
    let minp = 0;
    let maxp = 100;
    let minv = Math.log(32);
    let maxv = Math.log(16000);
    let scale = (maxv-minv) / (maxp-minp);

    return (Math.log(value)-minv) / scale + minp;
  })(band.frequency.value);

  bandGainInputEl.addEventListener('input', e => {
    band.gain.value = +e.target.value;
    bandGainEl.innerText = `${band.gain.value}db`;
  });

  bandFrequencyInputEl.addEventListener('input', e => {
    band.frequency.value = (position => {
      let minp = 0;
      let maxp = 100;
      let minv = Math.log(32);
      let maxv = Math.log(16000);
      let scale = (maxv-minv) / (maxp-minp);

      return Math.exp(minv + scale*(position-minp));
    })(+e.target.value);
    bandFrequencyEl.innerText = `${Math.round(band.frequency.value)}Hz`;
  });

  bandsEl.appendChild(bandEl);
}

document.querySelector('#runGenerator').addEventListener('click', e => {
  let generator = ctx.createGenerator();

  generator.type = 'triangle';
  generator.frequency.value = 100;
  generator.gain.value = 0.5;

  generator.start(0, 1);
  generator.to(ctx.destination);
});

import {DAW} from './lib/daw.js';
let daw = new DAW();

selectedInstrument = daw.createInstrument('trinity', {
  osc1Type: 'square',

  osc2Type: 'sawtooth',
  osc2Detune: 100,

  osc3Detune: -2400,
  osc3lfo: false,

  gainEnv: true,
  gainEnvDecay: 0.25,
  gainEnvSustain: 0,
});
let delayFX = daw.createFx('delay');

daw.mixer.assign(selectedInstrument, 1);
daw.mixer.addFx(delayFX, 1);
daw.mixer.set('master', 0.1);

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

  selectedInstrument.play(note, ctx.currentTime);

  active[e.keyCode] = true;
});

document.addEventListener('keyup', e => {
  let note = getNoteByKeyCode(e.keyCode);

  if (!active[e.keyCode] || !note) {
    return;
  }

  console.log(`stopped ${note}`);

  selectedInstrument.stop(note, ctx.currentTime);

  active[e.keyCode] = false;
});

function getNoteByKeyCode(keyCode) {
  return keys.includes(keyCode) ? octave * 12 + (keys.indexOf(keyCode) - 9) : null;
}
