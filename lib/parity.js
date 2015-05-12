'use strict';

/**
 * Calculates parity of a given number and returns value to set parity flag to.
 *
 * Mostly used to check for serial data communications correctness checking:
 *
 * > parity bit, or check bit is a bit added to the end of a string of binary code that indicates whether the number of
 * > bits in the string with the value one is even or odd. Parity bits are used as the simplest form of error detecting
 * > code.
 * > To determine odd parity if the sum of bits with a value of 1 is odd, the parity bit's value is set to zero.
 *
 * - [parity-flag](http://en.wikipedia.org/wiki/Parity_flag)
 * - [parity-bit](http://en.wikipedia.org/wiki/Parity_bit)
 *
 * **Summary**
 * - parity flag is set to `0` if the number of set bits is odd
 * - parity flag is set to `1` if the number of set bits is even
 *
 * This method takes around 9 operations, and works for 32-bit words.
 * It first shifts and XORs the eight nibbles of the 32-bit value together, leaving the result in the lowest
 * nibble of v.
 * Next, the binary number 0110 1001 1001 0110 (0x6996 in hex) is shifted to the right by the value
 * represented in the lowest nibble of v.
 * This number is like a miniature 16-bit parity-table indexed by the low four
 * bits in v.
 * The result has the parity of v in bit 1, which is masked and returned.
 *
 * [bithacks](http://graphics.stanford.edu/~seander/bithacks.html#ParityParallel)
 *
 * x86 parity only applies to the low 8 bits
 * [x86 caveat](https://github.com/asmblah/jemul8/blob/2e0357116d7a9f500dc21e443e3a2ffde8ee9f8a/js/util.js#L118)
 *
 * @name parity
 * @function
 * @param {Number} v 32-bit number to get parity for
 * @return {Number} `0` if odd, otherwise `1`
 */
var go = module.exports = function parity(v, x86) {
  // x86 parity only applies to the low 8 bits
  if (x86) { 
    v &= 0xff 
  } else {
    v ^= v >> 0x10;
    v ^= v >> 8;
  }
  v ^= v >> 4;
  v &= 0xf;
  var evenParity = (0x6996 >> v) & 0x1;
  return evenParity === 0 ? 1 : 0;

  /*var res = 0;
  while (v) {
    ++res;
    // execute once for each bit set in num
    v &= v - 1;
  }

  return (res % 2 === 0) & 1;
  */
}
