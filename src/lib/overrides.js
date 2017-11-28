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
}
