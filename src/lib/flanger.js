export class FlangerNode extends GainNode {
  constructor(ctx, preset = {}) {
    super(ctx);

    this._preset = Object.assign({
      delay: 0.005,
      depth: 0.002,
      feedback: 0.5,
      speed: 0.25
    }, preset);
    this._output = this.context.createGain();
    this._oscNode = this.context.createGenerator({
      type: 'sine',
      frequency: this._preset.speed,
      gain: this._preset.depth
    });
    this._delayNode = this.context.createDelay();
    this._wetNode = this.context.createGain();
    this._feedbackNode = this.context.createGain();

    this._oscNode.to(this._delayNode.delayTime);
    this.connect(this._wetNode).to(this._output);
    this.connect(this._delayNode).to(this._wetNode, this._feedbackNode);
    this._feedbackNode.to(this);

    this.delay = this._delayNode.delayTime;
    this.depth = this._oscNode.gain;
    this.speed = this._oscNode.frequency;
    this.feedback = this._feedbackNode.gain;

    this.feedback.value = this._preset.feedback;

    this._oscNode.start();
  }
}
