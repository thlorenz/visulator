'use strict';

var Memory = require('./memory')
  , Regs = require('./regs')

function ControlUnit(opts) {
  if (!(this instanceof ControlUnit)) return new ControlUnit(opts);
  this._opts = opts || {};
  this._memory = new Memory(this._opts.memSize);
  this._regs = new Regs();
}

var proto = ControlUnit.prototype;
module.exports = ControlUnit;

proto.load = function init(text, data, bss, stack, start) {
  this._regs.ebp = this._memory.init(text, data, bss, stack);
  this._regs.esp = this._regs.ebp;
  this._regs.eip = start;
}


/**
 * Fetches, decodes and executes next instruction and stores result.
 *
 * This implementation totally ignores a few things about modern processors and instead uses
 * a much simpler algorithm to fetch and execute instructions and store the results.
 *
 * Here are some concepts that make modern processors faster, but are not employed here, followed
 * by the simplified algorightm we actually use here.
 *
 * ### Pipelining
 *
 *  - instructions are processed in a pipe line fashion with about 5 stages, each happening  in parallel
 *    for multiple instructions
 *    - load instruction
 *    - decode instruction
 *    - fetch data
 *    - execute instruction
 *    - write results for instruction
 *  - at a given time instruction A is loaded,  B is decoded, data is fetched for C, D is executing
 *    and results for E are written
 *  - see: http://www.pctechguide.com/cpu-architecture/moores-law-in-it-architecture
 *
 *  ### Caches
 *
 *  - modern processors have L1, L2 and L3 caches
 *  - L1 and L2 are on the processor while L3 is connected via a high speed bus
 *  - data that is used a lot and namely the stack and code about to be executed is usually
 *    found in one of these caches, saving a more expensive trip to main memory
 *
 *  ### Branch Prediction
 *
 *  - in order to increase speed the processor tries to predict which branch of code is executed
 *    next in order to pre-fetch instructions
 *  - IA-64 replaces this by predication which even allows the processor to execute all
 *    possible branch paths in parallel
 *
 *  ### Translation to RISC like micro-instructions
 *
 *  - starting with the Pentium Pro (P6) instructions are translated into RISC like
 *    micro-instructions
 *  - these micro-instructions are then executed (instead of the original ones) on a
 *    highly advanced core
 *  - see: http://www.pctechguide.com/cpu-architecture/pentium-pro-p6-6th-generation-x86-microarchitecture
 *
 *  ### Simplified Algorithm
 *
 *  1. fetch next instruction (always from main memory -- caches don't exist here)
 *  2. decode instruction and decide what to do
 *  3. execute instruction, some directly here and others via the ALU
 *  4. store the result in registers/memory
 *  5. goto 1
 *
 *  1. and 2. basically become one step since we just call a function named after
 *  the opcode of the mnemonic.
 *
 *  We then fetch more bytes from the code in order to complete the instruction from memory (something
 *  that is inefficient and not done in the real world, where multiple instructions are pre-fetched
 *  instead).
 *
 * @name next
 * @function
 */
proto.next = function tick() {
  var codeAddr = this._regs.eip;
  var code = this._memory.fetch(codeAddr, 1);

  console.log(code);
}

proto.push = function push(bytes) {
  this._regs.esp -= bytes.length;
  this._memory.store(bytes, this._regs.esp);
}

// Test
function inspect(obj, depth) {
  console.error(require('util').inspect(obj, false, depth || 5, true));
}

if (!module.parent && typeof window === 'undefined') {
  var samples = require('../../test/fixtures/samples');
  var cu = new ControlUnit({ memSize: 0x1f });
  var stack = [ 'visulator' ];
  var data = [];
  var bss = [];
  var text = samples.small;
  cu.load(text, data, bss, stack, 0x0);
  inspect(cu)
  cu.tick();
}
