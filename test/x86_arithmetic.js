'use strict';
process.env.DEBUG = '*';

var test = require('tape')
var samples = require('./fixtures/samples')
var ControlUnit = require('../lib/x86/cu')

function init(code, regs) {
  var cu = new ControlUnit({ memSize: 0x1f });
  var opts = { text: code, regs: regs }
  return cu.init(opts);
}

function next(cu, n) {
  while(n-- > 0) cu.next();
  return cu.regs;
}

function inspect(obj, nocolor) {
  console.error(require('util').inspect(obj, false, 5, !nocolor));
}


test('\ndecrementingg registers', function (t) {
  var cu = init([ 0x48, 0x48, 0x49, 0x4f ], { eax: 0x2, ecx: 0x1, edi: 0x5 });

  var res = next(cu, 1) // dec eax
  t.equal(cu.regs.getFlag('ZF'), 0, 'initially ZF not set')
  t.equal(res.eax, 0x1, 'decs eax')
  t.equal(cu.regs.getFlag('ZF'), 0, 'ZF not set')
  t.equal(res.ecx, 0x1, 'leaves ecx alone')
  t.equal(res.edi, 0x5, 'leaves edi alone')

  res = next(cu, 1)     // dec eax
  t.equal(res.eax, 0x0, 'decs eax again')
  t.equal(cu.regs.getFlag('ZF'), 1, 'ZF set')

  res = next(cu, 1)     // dec ecx
  t.equal(res.eax, 0x0, 'leaves eax alone')
  t.equal(res.ecx, 0x0, 'decs ecx')
  t.equal(cu.regs.getFlag('ZF'), 1, 'ZF set')

  res = next(cu, 1)     // dec ecx
  t.equal(res.eax, 0x0, 'leaves eax alone')
  t.equal(res.ecx, 0x0, 'leaves ecx alone')
  t.equal(res.edi, 0x4, 'decs edi')
  t.equal(cu.regs.getFlag('ZF'), 0, 'ZF unset')

  t.end()
})
