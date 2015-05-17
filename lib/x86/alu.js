'use strict';

var size = require('../size')

var MAX = {};
MAX[size.BYTE]  = 0xff
MAX[size.WORD]  = 0xffff
MAX[size.DWORD] = 0xffffffff

function ArithmeticLogicUnit() {
  if (!(this instanceof ArithmeticLogicUnit)) return new ArithmeticLogicUnit();
  this.overflowed = false;
}

module.exports = ArithmeticLogicUnit;
var proto = ArithmeticLogicUnit.prototype;

proto.dec = function dec(v, nbytes) {
  return --v;
}

proto.inc = function inc(v, nbytes) {
  return this._checkOverflow(++v, nbytes)
}

proto._checkOverflow = function _checkOverflow(x, nbytes) {
  var max = MAX[nbytes];
  if (x <= max) {
    this.overflowed = false;
    return x
  }
  this.overflowed = true
  return x & max;
}
