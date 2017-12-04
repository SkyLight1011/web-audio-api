export class SynthComponentController {
  constructor(DAWService) {
    this.daw = DAWService;
    this.presets = this.daw.getPresets();
    this.preset = this.presets[0];
    this.instrument = this.daw.createInstrument(this.preset);

    this.daw.sequencer.assignInstrument(this.instrument, 1);
  }

  changePreset(preset) {
    this.instrument.setPreset(preset);
  }

  toggleFilter(filter) {
    filter.gain.value = filter.gain.value > 0 ? 0 : 1;
  }
}
