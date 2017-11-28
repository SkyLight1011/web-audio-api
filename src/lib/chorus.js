export class ChorusNode extends GainNode {
  constructor(ctx, preset = {}) {
    super(ctx);

    this._preset = Object.assign({
      delay: 0.005,
      depth: 0.0005,
      speed: 0.5
    }, preset);

    this._input = this.context.createGain();
    this._output = this.context.createGain();

    let splitter = this.context.createChannelSplitter(2);
    let merger = this.context.createChannelMerger(2);
    let wet = this.context.createGain();
    let delayL = this.context.createDelay();
    let delayR = this.context.createDelay();
    let delay = this.context.createConstantSource();
    let osc = this.context.createGenerator({
      type: 'triangle',
      frequency: this._preset.speed,
      gain: this._preset.depth
    });

    this.delay = delay.offset;
    this.depth = osc.gain;
    this.speed = osc.frequency;

    this._input.to(splitter, wet);
    delay.to(delayL.delayTime, delayR.delayTime);
    splitter.connect(delayL, 0);
    splitter.connect(delayR, 1);
    osc.to(this.delay);
    delayL.connect(merger, 0, 0);
    delayR.connect(merger, 0, 1);
    merger.to(wet).to(this._output);

    this.delay.value = this._preset.delay;

    delay.start();
    osc.start();
  }
}
