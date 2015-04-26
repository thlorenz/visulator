'use strict';
var disasm = require('../../lib/disasm.js');

function inspect(obj, depth) {
  console.log(require('util').inspect(obj, false, depth || 5, false));
}

var buffer = [0x55, 0x48, 0x8b, 0x05, 0xb8, 0x13, 0x00, 0x00];
var offset = 0x1000;

var instr = disasm(buffer, offset);
instr.forEach(inspect);
