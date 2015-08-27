'use strict';

var size = require('../size')

var MAX = {};
MAX[size.BYTE]  = 0xff
MAX[size.WORD]  = 0xffff
MAX[size.DWORD] = 0xffffffff

function ArithmeticLogicUnit() {
  if (!(this instanceof ArithmeticLogicUnit)) return new ArithmeticLogicUnit();
  this.carried = false;
}

module.exports = ArithmeticLogicUnit;
var proto = ArithmeticLogicUnit.prototype;

proto.dec = function dec(v, nbytes) {
  return this._checkOverflow(--v, nbytes);
}

proto.inc = function inc(v, nbytes) {
  return this._checkOverflow(++v, nbytes)
}

proto.add = function add(dst, src, nbytes) {
  return this._checkOverflow(dst + src, nbytes)
}

proto.sub = function and(dst, src, nbytes) {
  return this._checkOverflow(dst - src, nbytes)
}

proto.and = function add(dst, src, nbytes) {
  return this._checkOverflow(dst & src, nbytes)
}

proto._checkOverflow = function _checkOverflow(x, nbytes) {
  var max = MAX[nbytes];
  if (x <= max && x >= 0) {
    this.carried = false;
    return x
  }
  this.carried = true
  return x & max;
}
