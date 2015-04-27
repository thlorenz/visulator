'use strict';

var capstone = require('../deps/capstone');
var hexstring = require('./hexstring');

function addStrings(inst) {
  inst.addressString = inst.address.toString(16);
  inst.opcodesString = inst.bytes.map(hexstring).join(' ')
  return inst;
}

exports = module.exports = function disasm(buffer, offset) {
  var cs = new capstone.Cs(capstone.ARCH_X86, capstone.MODE_32);
  var instructions = cs.disasm(buffer, offset);

  cs.delete();
  return instructions.map(addStrings);
}

// Test
function inspect(obj, depth) {
  console.error(require('util').inspect(obj, false, depth || 5, true));
}
if (!module.parent && typeof window === 'undefined') {
  var disasm = exports;
  var offset = 0x1000;

  var instr = disasm(require('../test/fixtures/samples').strcpy, offset);
  instr.forEach(inspect);
}
