AudioNode.prototype.to = function (...targets) {
  for (let target of targets) {
    (this._output || this).connect(target && target._input || target);
  }

  return targets[0];
};

AudioNode.prototype.cut = function (target) {
  (this._output || this).disconnect(target && target._input || target);
};
