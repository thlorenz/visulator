'use strict';

/**
 * Calculates parity of a given number.
 *
 * Mostly used to check for serial data communications correctness checking:
 *
 * > parity bit, or check bit is a bit added to the end of a string of binary code that indicates whether the number of
 * > bits in the string with the value one is even or odd. Parity bits are used as the simplest form of error detecting
 * > code.
 *
 * [wiki](http://en.wikipedia.org/wiki/Parity_bit)
 *
 * If number is odd, parity is `1`.
 * If number is even, parity is `0`.
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
 * @name parity
 * @function
 * @param {Number} v 32-bit number to get parity for
 * @return {Number} `1` if odd, otherwise `0`
 */
var go = module.exports = function parity(v) {
  v ^= v >> 0x10;
  v ^= v >> 8;
  v ^= v >> 4;
  v &= 0xf;
  return (0x6996 >> v) & 0x1;
}
