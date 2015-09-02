'use strict';

var lowerFourBitsMask = 0x0000000f
  , instruction = require('./instruction')

/**
 * It indicates when a carry or borrow has been generated out of the least
 * significant four bits of the accumulator register following the execution
 * of an arithmetic instruction. It is primarily used in decimal (BCD)
 * arithmetic instructions.
 * [wiki](http://en.wikipedia.org/wiki/Half-carry_flag)
 *
 * @name auxiliary
 * @function
 * @param {Number} dst destination register
 * @param {Number} src source register
 * @return {Boolean} `true` if a *half-carry* occurs when adding src to dst, otherwise `false`
 */
var go = module.exports = function auxiliary(dst, src, op, sub) {
  if (  op === instruction.or
     || op === instruction.and) return false
  var lowerFourSrc = src & lowerFourBitsMask
    , lowerFourDst = dst & lowerFourBitsMask

  if (sub) lowerFourSrc = (~lowerFourSrc) + 1;

  var res = (lowerFourDst + lowerFourSrc)

  return 0xf <= res || res < 0;
}
