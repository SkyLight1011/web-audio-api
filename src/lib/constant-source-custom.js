export class CustomConstantSourceNode {
  constructor(ctx) {
    this.context = ctx;

    let bufferLen = 128;
    let buffer = this.context.createBuffer(1, bufferLen, this.context.sampleRate);

    this._bufferSource = this.context.createBufferSource();
    this._output = this.context.createGain();

    buffer.getChannelData(0).set(new Float32Array(bufferLen).fill(1));

    this._output.channelCount = 1;
    this._output.channelCountMode = 'explicit';
    this._output.channelInterpretation = 'discrete';
    this._bufferSource.buffer = buffer;
    this._bufferSource.loop = true;
    this._bufferSource.to(this._output);

    this.offset = this._output.gain;
  }

  start(at) {
    this._bufferSource.start(at);
  }

  stop(at) {
    this._bufferSource.stop(at);
  }

  to(...args) {
    return this._output.to(...args);
  }

  cut(...args) {
    this._output.cut(...args);
  }
}
