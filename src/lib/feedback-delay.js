export class FeedbackDelayNode extends GainNode {
  get [Symbol.toStringTag]() {
    return 'FeedbackDelayNode';
  }

  constructor(ctx, preset = {}) {
    super(ctx);

    let delay = this.context.createDelay();
    let feedback = this.context.createGain();
    let cutoff;

    this._preset = Object.assign({
      delay: 0.5,
      feedback: 0.5,
      cutoff: 2000,
      stereo: 0
    }, preset);
    this._output = this.context.createGain();

    feedback.gain.value = this._preset.feedback;
    delay.delayTime.value = this._preset.delay;

    if (this._preset.cutoff) {
      cutoff = this.context.createBiquadFilter();

      cutoff.frequency.value = this._preset.cutoff;
    }

    this.connect(this._output);

    if (this._preset.stereo) {
      let stereo = Math.abs(this._preset.stereo);
      let delayR = this.context.createDelay();
      let feedbackR = this.context.createGain();
      let splitter = this.context.createChannelSplitter(2);
      let merger = this.context.createChannelMerger(2);
      let isTrueStereo = false;

      delayR.delayTime.value = this._preset.delay;

      splitter.connect(delay, 0);

      if (isTrueStereo) { // For future inprovements
        splitter.connect(delayR, 1);
      }

      feedbackR.gain.value = this._preset.feedback;

      if (cutoff) {
        delay.to(feedback).to(cutoff).to(delayR).to(feedbackR).to(delay);
      } else {
        delay.to(feedback).to(delayR).to(feedbackR).to(delay);
      }

      feedback.connect(merger, 0, 0);
      feedbackR.connect(merger, 0, 1);

      this.connect(splitter);
      merger.to(this._output);
    } else {
      this.to(delay).to(feedback);

      if (cutoff) {
        feedback.to(filter).to(this._output);
      } else {
        feedback.to(this._output);
      }
    }
  }
}
