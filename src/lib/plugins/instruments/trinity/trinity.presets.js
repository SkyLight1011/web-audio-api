export default [
  {
    id: '1',
    name: '1',
    preset: {
      osc1Type: 'sine',

      osc2Type: 'sawtooth',
      osc2Detune: 200,

      osc3Detune: -2400,
      osc3lfo: true,

      gainEnv: {
        enabled: true,
        decay: 0.25,
        sustain: 0.25,
        release: 0.2
      },

      filterEnv: {
        enabled: true,
        amount: 0.25,
        attack: 0.01,
        decay: 0.25,
        sustain: 0.1,
        release: 1
      }
    }
  },
  {
    id: 'saw',
    name: 'Saw',
    preset: {
      osc1Type: 'pink',
      osc1Gain: 0.5,

      osc2Type: 'square',

      osc3Type: 'sawtooth',
      detune: -2400,
      osc3lfo: true,

      gainEnv: true,
      gainEnvDecay: 0.25,
      gainEnvSustain: 0.5,
      gainEnvRelease: 1,

      filterEnv: false
    }
  },
  {
    id: 'power',
    name: 'Power',
    preset: {
      osc1Type: 'triangle',

      osc2Type: 'sawtooth',
      osc2Detune: 700,
      osc2Gain: 0.3,

      osc3Type: 'pink',
      osc3Gain: 0.2,

      gainEnv: true,
      gainEnvAttack: 0.01,
      gainEnvSustain: 1,
      gainEnvRelease: 0.2
    }
  },
  {
    id: 'bass',
    name: 'Bass',
    preset: {
      master: 0.3,

      osc1Type: 'square',
      osc1Detune: -1200,

      osc2Type: 'square',
      osc2Detune: -500,

      osc3Type: 'square',
      osc3Detune: 0,

      gainEnv: true,
      gainEnvAttack: 0.01,
      gainEnvSustain: 1,
      gainEnvRelease: 0.2,

      filterType: 'lowpass',
      filterCutoff: 500
    }
  },
  {
    id: 'neuro saw',
    name: 'Neuro Saw',
    preset: {
      filterType: 'lowpass',
      filterCutoff: 900,

      gainEnv: true,
      gainEnvAttack: 0.001,
      gainEnvDecay: 0.25,
      gainEnvRelease: 0.3,
      gainEnvSustain: 0.75,

      gainLFODelay: 2.5,

      osc1Type: 'sawtooth',

      osc2Type: 'sawtooth',
      osc2CoarseDetune: 0.99,
    }
  }
];

/*
let instrumentConfigs = [
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
  }
];
*/
