'use strict';

function ArithmeticLogicUnit() {
  if (!(this instanceof ArithmeticLogicUnit)) return new ArithmeticLogicUnit();
}

module.exports = ArithmeticLogicUnit;
var proto = ArithmeticLogicUnit.prototype;

proto.dec = function dec(v) {
  return --v;
}
