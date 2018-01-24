import {TestAudioContext} from './lib/audio-context.js';

let ctx = new TestAudioContext();

let master = ctx.createGain();
let control = ctx.createCustomConstantSource();
let osc = ctx.createOscillator();
let playing = false;

osc.frequency.setValueAtTime(45, ctx.currentTime);
osc.start(ctx.currentTime);

control.to(master.gain);
master.to(ctx.destination);
control.start(ctx.currentTime);

document.querySelector('#r').value = control.offset.value;

document.querySelector('#r').addEventListener('input', e => {
  control.offset.setValueAtTime(+e.target.value, ctx.currentTime);
});

document.querySelector('#b').addEventListener('click', e => {
  if (playing) {
    osc.cut();
  } else {
    osc.to(master);

    console.log(control, master);
  }

  playing = !playing;
});
