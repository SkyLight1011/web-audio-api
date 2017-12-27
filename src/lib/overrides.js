AudioNode.prototype.to = function (...targets) {
  for (let target of targets) {
    (this._output || this).connect(target && target._input || target);
  }

  return targets[0];
};

AudioNode.prototype.cut = function (target) {
  (this._output || this).disconnect(target && target._input || target);
};

let connect = AudioNode.prototype.connect;
let disconnect = AudioNode.prototype.disconnect;

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

AudioParam.prototype.set = function (value, time = 0, type = 0) {
  let t = 0;//this.context.t;

  time = (time < t) ? t : time;

  switch (type) {
    case 1:
      this.linearRampToValueAtTime(value, time);
      break;
    case 2:
      this.exponentialRampToValueAtTime(Math.max(value, 0.0001), time);
      break;
    default:
      this.setValueAtTime(value, time);

      if (time <= t && value !== this.value) {
        this.value = value;
      }
  }
}
