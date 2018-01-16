const keys = [65, 87, 83, 69, 68, 70, 82, 71, 84, 72, 89, 74];

export class SynthComponentController {
  constructor($document, DAWService) {
    this.$doc = $document;
    this.daw = DAWService;

    this.octave = 4;
    this.instrument = this.daw.createInstrument('trinity');
    this.active = {};
  }

  $onInit() {
    this.$doc.on('keydown', e => this._trigger(e.keyCode));
    this.$doc.on('keyup', e => this._release(e.keyCode));
  }

  _trigger(key) {
    let note = this._getNoteByKeyCode(key);

    if (this.active[key]) {
      return;
    }

    if (key === 107) {
      this.octave++;
    } else if (key === 109) {
      this.octave--;
    }

    if (!note) {
      return;
    }

    this.instrument.play(note);

    this.active[key] = true;
  }

  _release(key) {
    let note = this._getNoteByKeyCode(key);

    if (!this.active[key] || !note) {
      return;
    }

    this.instrument.stop(note);

    this.active[key] = false;
  }

  _getNoteByKeyCode(keyCode) {
    return keys.includes(keyCode) ? this.octave * 12 + (keys.indexOf(keyCode) - 9) : null;
  }
}
