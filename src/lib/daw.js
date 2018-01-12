import {TestAudioContext} from './audio-context.js';
import {Sequencer} from './modules/sequencer/sequencer.js';
import {Mixer} from './modules/mixer/mixer.js';
import instruments from './plugins/instruments/index.js';
import fx from './plugins/fx/index.js';

export class DAW {
  constructor() {
    this.context = new TestAudioContext();

    this.sequencer = new Sequencer(this);
    this.mixer = new Mixer(this);
    this._output = this.context.createGain();

    this._instruments = instruments.reduce((list, instrument) => {
      list[instrument.id] = instrument;

      return list;
    }, {});
    this._fx = fx.reduce((list, fx) => {
      list[fx.id] = fx;

      return list;
    }, {});

    this.mixer.to(this.context.destination);
  }

  createInstrument(name, preset) {
    let Instrument = this._instruments[name];

    if (!Instrument) {
      throw new Error(`Instrument ${name} is not registered`);
    }

    return new Instrument(this.context, preset);
  }

  createFx(name, preset = {}) {
    let FX = this._fx[name];

    if (!FX) {
      throw new Error(`FX ${name} is not registered`);
    }

    return new FX(this.context, preset);
  }
}
