'use strict';

var SIZE = 32
var BYTE_SIZE = 8

/**
 * Determines if a number is signed, i.e. the most significant bit is set
 *
 * [bithacks](http://graphics.stanford.edu/~seander/bithacks.html#CopyIntegerSign)
 * 
 * @name signed
 * @function
 * @param {Number} v to check for signedness
 * @return {Boolean} `true` if number is signed, otherwise `false`
 */
var go = module.exports = function signed(v) {
  return(v >> (SIZE * BYTE_SIZE - 1)) === -1;
}
