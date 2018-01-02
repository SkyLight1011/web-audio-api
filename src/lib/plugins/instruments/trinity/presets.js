export default [
  {
    name: '1',
    preset: {
      master: 0.5,

      osc1Type: 'sine',

      osc2Type: 'sawtooth',
      osc2Detune: 100,

      osc3Detune: -2400,
      osc3lfo: false,

      gainEnv: true,
      gainEnvDecay: 0.25,
      gainEnvSustain: 0.5,
      gainEnvRelease: 1,

      filterEnv: false,
      filterEnvAmount: 0.25,
      filterEnvAttack: 0.01,
      filterEnvDecay: 0.25,
      filterEnvSustain: 0.1,
      filterEnvRelease: 1
    }
  }
];

/*
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
*/
