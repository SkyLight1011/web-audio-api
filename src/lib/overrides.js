const connect = AudioNode.prototype.connect;
const disconnect = AudioNode.prototype.disconnect;

export default function (ctx) {
  AudioNode.prototype.to = function (...targets) {
    for (let target of targets) {
      (this._output || this).connect(target && target._input || target);
    }

    return targets[0];
  };

  AudioNode.prototype.cut = function (target) {
    (this._output || this).disconnect(target && target._input || target);
  };

  AudioNode.prototype.connect = function (target) {
    this._targets || (this._targets = []);
    this._targets.push(target);

    connect.call(this, ...arguments);
  };

  AudioNode.prototype.disconnect = function (target) {
    if (!target) {
      this._targets = [];
    } else {
      let index = (this._targets || []).indexOf(target);

      if (index > -1) {
        this._targets.splice(index, 1);
      }
    }

    disconnect.call(this, ...arguments);
  };

  AudioNode.prototype.connectWith = function (node) {
    let targets = Array.from(this._targets);

    this.cut();
    this.to(node);

    targets.map(node.to);
  };

  AudioNode.prototype.mute = function (mute) {
    if (mute) {
      disconnect.call(this);
    } else if (this._targets && this._targets.length) {
      connect.call(this, ...this._targets);
    }
  };

  AudioParam.prototype.set = function (value, at = 0, type) {
    let dur = 0;

    if (Array.isArray(at)) {
      [at, dur] = at;
    }

    at = Math.max(at, ctx.currentTime);

    switch (type) {
      case 1:
        this.linearRampToValueAtTime(value, at);
        break;
      case 2:
        this.exponentialRampToValueAtTime(Math.max(value, 0.0001), at);
        break;
      case 3:
        this.setTargetAtTime(Math.max(value, 0.0001), at, dur);
        break;
      default:
        this.setValueAtTime(value, at);
    }
  };
}
