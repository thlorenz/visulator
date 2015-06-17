'use strict';

var zeroPad = '00000000000000000000000000000000'

// Convenience functions to convert numbers to binary representations

var string = exports.string = function string(num, bytes) {
  var s = num.toString(2)
  return (zeroPad.slice(0, (bytes * 8) - s.length) + s)
}

exports.array = function binaryArray(num, bytes) {
  var s = string(num, bytes);
  return s.split('').map(Number)
}

