'use strict';

var lowerFourBitsMask = 0x0000000f

/**
 * Determnies if a carry or borrow has been generated out of the least significant four bits
 * when adding src to dst
 * [wiki](http://en.wikipedia.org/wiki/Half-carry_flag)
 * 
 * @name auxiliary
 * @function
 * @param {Number} dst destination register
 * @param {Number} src source register
 * @return {Boolean} `true` if a *half-carry* occurs when adding src to dst, otherwise `false`
 */
var go = module.exports = function auxiliary(dst, src, sub) {
  var lowerFourSrc = src & lowerFourBitsMask
    , lowerFourDst = dst & lowerFourBitsMask

  if (sub) lowerFourSrc = (~lowerFourSrc) + 1;
  
  var res = (lowerFourDst + lowerFourSrc)
  return 0xf <= res || res < 0;
}
