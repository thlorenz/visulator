'use strict';

var capstone = require('../deps/capstone');

exports = module.exports = function disasm(buffer, offset) {
  var cs = new capstone.Cs(capstone.ARCH_X86, capstone.MODE_32);
  var instructions = cs.disasm(buffer, offset);

  cs.delete();
  return instructions;
}

// Test
function inspect(obj, depth) {
  console.error(require('util').inspect(obj, false, depth || 5, true));
}
if (!module.parent && typeof window === 'undefined') {
  var disasm = exports;

  var buffer = [0x55, 0x48, 0x8b, 0x05, 0xb8, 0x13, 0x00, 0x00];
  var offset = 0x1000;

  var instr = disasm(buffer, offset);
  instr.forEach(inspect);
}
