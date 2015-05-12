'use strict';

function ArithmeticLogicUnit(max) {
  if (!(this instanceof ArithmeticLogicUnit)) return new ArithmeticLogicUnit(max);
  this._max = max;
  this.overflowed = false;
}

module.exports = ArithmeticLogicUnit;
var proto = ArithmeticLogicUnit.prototype;

proto.dec = function dec(v) {
  return --v;
}

proto.inc = function inc(v) {
  return this._checkOverflow(++v)
}

proto._checkOverflow = function _checkOverflow(x) {
  if (x <= this._max) {
    this.overflowed = false;
    return x
  }
  this.overflowed = true
  return x & this._max;
}
