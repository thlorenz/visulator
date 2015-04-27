'use strict';

/**
 * Converts given number to a two digit hex str
 * 
 * @name hexstring
 * @function
 * @param {Number} x number between 0x00 and 0xff
 * @return two digit string representation
 */
module.exports = function hexstring(x) {
  var hex = x.toString(16);
  return hex.length < 2 ? '0' + hex : hex;
}
