'use strict';

/**
 * Antidote to leVal.
 * Converts a value into a buffer of n bytes ordered little endian.
 *
 * @name leBytes
 * @function
 * @param {Number} val value 8, 16 or 32 bits
 * @param {Number=} nbytes number of bytes of the value to include (default: 4)
 * @return {Array.<Number>} byte representation of the given @see val
 */
var leBytes = module.exports = function leBytes(val, nbytes) {
  nbytes = nbytes || 4;
  if (nbytes > 4) throw new Error('Only up to 4 bytes memory chunks supported, this is ' + nbytes + ' bytes');

  var b0, b1, b2, b3;

  b0 =  val & 0xff  // al
  if (nbytes === 1) return [ b0 ];

  b1 = val >> 8  & 0xff    // ah
  if (nbytes === 2) return [ b0, b1 ];

  b2 = val >> 16 & 0xff    // lower byte of upper word
  b3 =  val >> 24 & 0xff   // upper byte of upper word
  return [ b0, b1, b2, b3 ];
}
