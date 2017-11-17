export class FeedbackDelayNode extends DelayNode {
  constructor(ctx, delay, feedback, maxRepeat) {
    super(ctx);

    var g = ctx.createGain(maxRepeat);

    g.gain.value = feedback;

    this.delayTime.value = delay;

    this.to(g).to(this);
  }
}
