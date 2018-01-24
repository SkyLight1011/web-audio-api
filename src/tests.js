import {TestAudioContext} from './lib/audio-context.js';
import {Param} from './lib/param.js';

let ctx = new TestAudioContext();

let param = new Param(ctx, {
  min: 0,
  max: 1,
  default: 1
});
let osc = ctx.createGenerator({frequency: 100});
let master = ctx.createGain();

param.to(osc.gain);
osc.to(master).to(ctx.destination);

//osc.start();

document.querySelector('#r').value = param.value;

document.querySelector('#r').addEventListener('input', e => {
  param.set(+e.target.value);
});

document.querySelector('#b').addEventListener('click', e => {
  /*if (playing) {
    osc.cut();
  } else {
    osc.to(master);

    console.log(control, master);
  }

  playing = !playing;*/
});
