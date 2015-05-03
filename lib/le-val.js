'use strict';

/**
 * Calculates value of little endian ordered bytes.
 *
 * ```js
 *
 * leVal([ 0x00, 0x00, 0x00, 0x00 ]) // => 0x00 00 00 ff (            0)
 * leVal([ 0x01, 0x00, 0x00, 0x00 ]) // => 0x00 00 00 ff (            1)
 * leVal([ 0xff, 0x00, 0x00, 0x00 ]) // => 0x00 00 00 ff (          255)
 * leVal([ 0x00, 0x01, 0x00, 0x00 ]) // => 0x00 00 01 00 (          256)
 * leVal([ 0x01, 0x01, 0x00, 0x00 ]) // => 0x00 00 01 01 (          257)
 * leVal([ 0xff, 0x01, 0x00, 0x00 ]) // => 0x00 00 01 ff (          511)
 * leVal([ 0xff, 0xff, 0x00, 0x00 ]) // => 0x00 00 ff ff (       65,535)
 * leVal([ 0x00, 0x00, 0xff, 0x00 ]) // => 0x00 ff 00 00 (   16,711,680)
 * leVal([ 0xff, 0xff, 0xff, 0x00 ]) // => 0x00 ff ff ff (  16,777,215 )
 * leVal([ 0x00, 0x00, 0x00, 0x0f ]) // => 0x0f 00 00 00 ( 251,658,240 )
 * leVal([ 0x00, 0x00, 0x00, 0xf0 ]) // => 0xf0 00 00 00 (4,026,531,840)
 * leVal([ 0x00, 0x00, 0x00, 0xff ]) // => 0xff 00 00 00 (4,278,190,080)
 * leVal([ 0xff, 0xff, 0xff, 0xff ]) // => 0xff ff ff ff (4,294,967,295)
 * ```
 * 
 * @name leVal
 * @function
 * @param {Array.<Number>} bytes bytes that contain number representation
 * @param {Number=} nbytes number of bytes, if not given it is deduced
 * @return {Number} number contained in bytes 
 */
var leVal = module.exports = function leVal(bytes, nbytes) {
  nbytes = nbytes || bytes.length;
  if (nbytes > 4) throw new Error('Only up to 4 bytes memory chunks supported, this is ' + nbytes + ' bytes');

  var b0 = bytes[0] || 0x0
  var b1 = bytes[1] || 0x0
  var b2 = bytes[2] || 0x0
  var b3 = bytes[3] || 0x0

  return ((b3 << 23) * 2) // << 24 results in negative number
        + (b2 << 16) 
        + (b1 << 8) 
        + (b0);
}

// Test
if (!module.parent && typeof window === 'undefined') {
  console.log(leVal([ 0x00, 0x00, 0x00, 0x00 ])) // => 0x00 00 00 ff (            0)
  console.log(leVal([ 0x01, 0x00, 0x00, 0x00 ])) // => 0x00 00 00 ff (            1)
  console.log(leVal([ 0xff, 0x00, 0x00, 0x00 ])) // => 0x00 00 00 ff (          255)
  console.log(leVal([ 0x00, 0x01, 0x00, 0x00 ])) // => 0x00 00 01 00 (          256)
  console.log(leVal([ 0x01, 0x01, 0x00, 0x00 ])) // => 0x00 00 01 01 (          257)
  console.log(leVal([ 0xff, 0x01, 0x00, 0x00 ])) // => 0x00 00 01 ff (          511)
  console.log(leVal([ 0xff, 0xff, 0x00, 0x00 ])) // => 0x00 00 ff ff (       65,535) 
  console.log(leVal([ 0x00, 0x00, 0xff, 0x00 ])) // => 0x00 ff 00 00 (   16,711,680)
  console.log(leVal([ 0xff, 0xff, 0xff, 0x00 ])) // => 0x00 ff ff ff (  16,777,215 )
  console.log(leVal([ 0x00, 0x00, 0x00, 0x0f ])) // => 0x0f 00 00 00 ( 251,658,240 )
  console.log(leVal([ 0x00, 0x00, 0x00, 0xf0 ])) // => 0xf0 00 00 00 (4,026,531,840)
  console.log(leVal([ 0x00, 0x00, 0x00, 0xff ])) // => 0xff 00 00 00 (4,278,190,080)
  console.log(leVal([ 0xff, 0xff, 0xff, 0xff ])) // => 0xff ff ff ff (4,294,967,295)
}
