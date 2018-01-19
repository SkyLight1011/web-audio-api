import {FxPlugin} from '../../../fx-plugin.js';

const bands = 10;

export class ParametreqFX extends FxPlugin {
  constructor(...args) {
    super(...args);
  }

  static get id() {
    return 'parametreq';
  }

  get defaults() {
    let params = {};
    let defaultFreq = [32, 64, 125, 250, 500, 1000, 2000, 4000, 8000, 16000];

    for (let i = 0; i < bands; i++) {
      params[`band${i + 1}Frequency`] = {
        name: 'Freq',
        unit: 'Hz',
        min: 20,
        max: 2e4,
        default: defaultFreq[i],
        callback: (value, at, type) => this._bands[i].frequency.set(value, at, type)
      };
      params[`band${i + 1}Q`] = {
        name: 'Q',
        min: 0,
        max: 40,
        default: 2,
        callback: (value, at, type) => this._bands[i].Q.set(value, at, type)
      };
      params[`band${i + 1}Amp`] = {
        name: 'Amp',
        min: -40,
        max: 40,
        default: 0,
        callback: (value, at, type) => this._bands[i].gain.set(value, at, type)
      };
    }

    return Object.assign({}, super.defaults, params);
  }

  setup() {
    super.setup();

    this._bands = [];

    for (let i = 0; i < bands; i++) {
      let band = this.context.createBiquadFilter();

      if (i === 0) {
        band.type = 'lowshelf';
      } else if (i === bands - 1) {
        band.type = 'highshelf';
      } else {
        band.type = 'peaking';
      }

      band.frequency.set(this.get(`band${i + 1}Frequency`));
      band.Q.set(this.get(`band${i + 1}Q`));
      band.gain.set(this.get(`band${i + 1}Amp`));

      this._bands.push(band);

      this._bands
        .reduce((prev, curr) => prev.to(curr), this._fx)
        .to(this._output);
    }
  }
}
