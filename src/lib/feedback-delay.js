export class FeedbackDelayNode extends GainNode {
  constructor(ctx, preset = {}) {
    super(ctx);

    let delay = this.context.createDelay();
    let feedback = this.context.createGain();

    this._preset = Object.assign({
      delay: 0.5,
      feedback: 0.5,
      cutoff: 2000
    }, preset);
    this._output = this.context.createGain();

    feedback.gain.value = this._preset.feedback;
    delay.delayTime.value = this._preset.delay;

    this.connect(this._output);
    this.to(delay).to(feedback);

    if (this._preset.cutoff) {
      let filter = this.context.createBiquadFilter();

      filter.frequency.value = this._preset.cutoff;

      feedback.to(filter).to(this._output);
    } else {
      feedback.to(this._output);
    }
  }
}
