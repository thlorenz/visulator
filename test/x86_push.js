'use strict';
process.env.DEBUG = '*';

var test = require('tape')
var samples = require('./fixtures/samples')
var ControlUnit = require('../lib/x86/cu')

function init(code, regs, stack) {
  var cu = new ControlUnit({ memSize: 0x1f });
  var opts = { stack: stack, text: code, regs: regs }
  return cu.init(opts);
}

function run(cu, n) {
  while(n-- > 0) cu.next();
  return { esp: cu.regs.esp, stack: cu.mem.stack(cu.regs.esp) }
}

function inspect(obj, nocolor) {
  console.error(require('util').inspect(obj, false, 5, !nocolor));
}

// TODO: finish all ops only affecting registers first
/*test('\npushing regs to the stack one after the other starting with empty stack', function (t) {
  var regs = {
    eax: 0x1, ecx: 0x2, ebx: 0x3, edx: 0x4, esi: 0x5, edi: 0x6
  };
  var cu = init(samples.pushEachReg, regs, [])

  var res = run(cu, 1)
   t.deepEqual(res, { esp: 30, stack: [ 1 ] }, 'after 1 instruction stack and esp as expected')
  res = run(cu, 2)
  t.deepEqual(res, { esp: 28, stack: [ 4, 2, 1 ] }, 'after 2 more instructions stack and esp as expected')
  res = run(cu, 5)
  t.deepEqual(res, { esp: 23, stack: [ 6, 5, 31, 27, 3, 4, 2, 1 ] }, 'after 5 more instructions stack and esp as expected')
  t.end()
})*/
