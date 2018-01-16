import {DAW} from '../../lib/daw.js';

export class DAWService {
  constructor() {
    this.daw = new DAW();
  }

  createInstrument(id) {
    let instrument = this.daw.createInstrument(id);

    this.daw.mixer.assign(instrument, 1);

    return instrument;
  }

  getMixer() {
    return this.daw.mixer;
  }
}
