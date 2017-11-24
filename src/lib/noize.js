export class NoizeNode extends GainNode {
  get [Symbol.toStringTag]() {
    return 'NoizeNode';
  }

  constructor(ctx, type) {
    super(ctx);

    let noiseBuffer;

    this._noizeNode = this.context.createBufferSource();

    switch (type.toLowerCase()) {
      case 'white':
        noiseBuffer = this._whiteNoize();
        break;
      case 'pink':
        noiseBuffer = this._pinkNoize();
        break;
      case 'brown':
      case 'brownian':
      case 'red':
        noiseBuffer = this._brownianNoize();
        break;
      default:
        throw new Exception(`Unsupported noize type <${type}>`);
    }

    this._noizeNode.buffer = noiseBuffer;
    this._noizeNode.loop = true;

    this._noizeNode.connect(this);

    this.detune = this._noizeNode.detune;
  }

  start(at = 0, dur = 0) {
    !at && (at = this.context.currentTime);

    this._noizeNode.start(at);

    dur && this.stop(at + dur);
  }

  stop(at = 0) {
    !at && (at = this.context.currentTime);

    this._noizeNode.stop(at);
  }

  _whiteNoize() {
    let bufferSize = 2 * this.context.sampleRate;
    let noiseBuffer = this.context.createBuffer(1, bufferSize, this.context.sampleRate);
    let output = noiseBuffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    return noiseBuffer;
  }

  _pinkNoize() {
    let bufferSize = 2 * this.context.sampleRate;
    let noiseBuffer = this.context.createBuffer(1, bufferSize, this.context.sampleRate);
    let output = noiseBuffer.getChannelData(0);
    let b0, b1, b2, b3, b4, b5, b6;

    b0 = b1 = b2 = b3 = b4 = b5 = b6 = 0.0;

    for (let i = 0; i < bufferSize; i++) {
      let white = Math.random() * 2 - 1;

      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;

      output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
      output[i] *= 0.11;
      b6 = white * 0.115926;
    }

    return noiseBuffer;
  }

  _brownianNoize() {
    let bufferSize = 2 * this.context.sampleRate;
    let noiseBuffer = this.context.createBuffer(1, bufferSize, this.context.sampleRate);
    let output = noiseBuffer.getChannelData(0);
    let lastOut = 0.0;

    for (let i = 0; i < bufferSize; i++) {
      let white = Math.random() * 2 - 1;

      output[i] = (lastOut + (0.02 * white)) / 1.02;
      lastOut = output[i];
      output[i] *= 3.5;
    }

    return noiseBuffer;
  }
}
