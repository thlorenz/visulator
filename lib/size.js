'use strict';

exports.BYTE  = 1
exports.WORD  = 2
exports.DWORD = 4

exports.toString = function toString(bytes) {
  return  bytes === exports.BYTE  ? 'BYTE'
        : bytes === exports.WORD  ? 'WORD'
        : bytes === exports.DWORD ? 'DWORD'
        : 'N/A'
}
