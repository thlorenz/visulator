'use strict';

var DWORD = 4 
var BYTE_SIZE = 8

/**
 * Determines if a number is signed, i.e. the most significant bit is set
 *
 * [bithacks](http://graphics.stanford.edu/~seander/bithacks.html#CopyIntegerSign)
 * 
 * @name signed
 * @function
 * @param {Number} v to check for signedness
 * @param {Number} nbytes size of the value in bytes
 * @return {Boolean} `true` if number is signed, otherwise `false`
 */
var go = module.exports = function signed(v, nbytes) {
  nbytes = nbytes || DWORD;
  var sr = nbytes * BYTE_SIZE - 1
    , res = v >> sr 
  return res === -1 || res === 1;
}
