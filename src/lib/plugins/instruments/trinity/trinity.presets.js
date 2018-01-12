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

      gainEnv: true,
      gainEnvDecay: 0.25,
      gainEnvSustain: 0.25,
      gainEnvRelease: 0.2,

      filterEnv: true,
      filterEnvAmount: 0.25,
      filterEnvAttack: 0.01,
      filterEnvDecay: 0.25,
      filterEnvSustain: 0.1,
      filterEnvRelease: 1
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
      master: 0.1,

      osc1Type: 'square',

      osc2Type: 'square',
      detune: 700,

      osc3Type: 'square',
      detune: 1200,

      gainEnv: true,
      gainEnvAttack: 0.01,
      gainEnvSustain: 1,
      gainEnvRelease: 0.2
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
