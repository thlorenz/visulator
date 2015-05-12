'use strict';

var MAX_UNSIGNED = {
  1: 0x7f, 2: 0x7fff, 4: 0x7fffffff
}

/**
 * Calculates if an overflow occurred due to the last arithmetic operation.
 *
 * The overflow flag is set when the most significant bit (sign bit) is changed
 * by adding two numbers with the same sign or subtracting two numbers with opposite signs.
 *
 * A negative result out of positive operands (or vice versa) is an overflow.
 *
 * [overflow flag](http://en.wikipedia.org/wiki/Overflow_flag)
 *
 * @name overflow
 * @function
 * @param {Number} op1 first operand of the arithmetic operation
 * @param {Number} op2 second operand of the arithmetic operation
 * @param {Number} res result of the arithmetic operation
 * @param {Number} nbytes byte sizes of the operands and the result
 * @return {Boolean} `true` if an overflow occurred, otherwise `false`
 */
var go = module.exports = function overflow(op1, op2, res, nbytes) {
  var maxu = MAX_UNSIGNED[nbytes];

  // if operands have different signs no overflow could have occurred
  if (op1 > maxu && op2 <= maxu) return false;
  if (op1 <= maxu && op2 > maxu) return false;

  // ops do have sign bit set, but result doesn't
  if (op1 > maxu && res <= maxu) return true;
  // ops don't have sign bit set, but result does
  if (op1 <= maxu && res > maxu) return true;

  return false;
}
