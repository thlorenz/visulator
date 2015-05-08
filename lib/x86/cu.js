'use strict';

var xtend  = require('xtend')
  , hex    = require('../hexstring')
  , leVal  = require('../le-val')
  , debug  = require('debug')('cpu')
  , Memory = require('./memory')
  , Regs   = require('./regs')
  , ALU    = require('./alu')

function ControlUnit() {
  if (!(this instanceof ControlUnit)) return new ControlUnit();
  this.mem = new Memory();
  this.regs = new Regs();
  this.alu = new ALU();
}

var proto = ControlUnit.prototype;
module.exports = ControlUnit;

var defaultOpts = {
    stack      : []
  , bss        : []
  , data       : []
  , text       : []
  , entryPoint : 0x0
}

proto.init = function init(opts) {
  opts = xtend(defaultOpts, opts)
  if (opts.regs) this.regs.assign(opts.regs);

  this.regs.esp = this.mem.init(
      opts.memSize
    , opts.entryPoint
    , opts.text
    , opts.data
    , opts.bss
    , opts.stack);

  this.regs.eip = opts.entryPoint
  return this;
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
 * **Pipelining**
 *
 * - instructions are processed in a pipe line fashion with about 5 stages, each happening  in parallel
 *   for multiple instructions
 *   - load instruction
 *   - decode instruction
 *   - fetch data
 *   - execute instruction
 *   - write results for instruction
 * - at a given time instruction A is loaded,  B is decoded, data is fetched for C, D is executing
 *   and results for E are written
 * - see: [moores-law-in-it-architecture](http://www.pctechguide.com/cpu-architecture/moores-law-in-it-architecture)
 *
 * **Caches**
 *
 * - modern processors have L1, L2 and L3 caches
 * - L1 and L2 are on the processor while L3 is connected via a high speed bus
 * - data that is used a lot and namely the stack and code about to be executed is usually
 *   found in one of these caches, saving a more expensive trip to main memory
 *
 * **Branch Prediction**
 *
 * - in order to increase speed the processor tries to predict which branch of code is executed
 *   next in order to pre-fetch instructions
 * - IA-64 replaces this by predication which even allows the processor to execute all
 *   possible branch paths in parallel
 *
 * **Translation to RISC like micro-instructions**
 *
 * - starting with the Pentium Pro (P6) instructions are translated into RISC like
 *   micro-instructions
 * - these micro-instructions are then executed (instead of the original ones) on a
 *   highly advanced core
 * - see: [pentium-pro-p6-6th-generation-x86-microarchitecture](http://www.pctechguide.com/cpu-architecture/pentium-pro-p6-6th-generation-x86-microarchitecture)
 *
 * **Simplified Algorithm**
 *
 * - 1) fetch next instruction (always from main memory -- caches don't exist here)
 * - 2) decode instruction and decide what to do
 * - 3) execute instruction, some directly here and others via the ALU
 * - 4) store the result in registers/memory
 * - 5) goto 1
 *
 * 1. and 2. basically become one step since we just call a function named after
 * the opcode of the mnemonic.
 *
 * We then fetch more bytes from the code in order to complete the instruction from memory (something
 * that is inefficient and not done in the real world, where multiple instructions are pre-fetched
 * instead).
 *
 * The decoder is authored using [this information](http://ref.x86asm.net/coder32.html).
 *
 * @name cu::next
 * @function
 */
proto.next = function next() {
  // fetch next instruction
  var codeAddr = this.regs.eip++;
  var opcode = this.mem.load(codeAddr, 1)[0]
    , opcodeString = hex(opcode || 0)

  var decoded = this._opcodeTable[opcode]
  if (!decoded) return debug('Unknown opcode %s', opcodeString);

  var asm          = decoded[1]
    , asmString    = asm.join(' ')
    , handler      = decoded[0]
    , nbytes       = decoded[2]

  var nbytesString = nbytes === BYTE
      ? 'BYTE' : nbytes === WORD
      ? 'WORD' : 'DWORD'

  debug('opcode: %d', opcode)
  debug('%s\t %s\t; %s(\'%s\', [ %s ], %s)',
        opcodeString, asmString, handler, opcodeString, asm, nbytesString);
  this[handler](opcode, asm, nbytes)
}

var BYTE  = 1
  , WORD  = 2
  , DWORD = 4

//
// Instructions
//

proto._opcodeTable = {
    0x00: [  ] // not used
  , 0x48: [ '_dec'      , [ 'dec'  , 'eax' ] , BYTE ]
  , 0x49: [ '_dec'      , [ 'dec'  , 'ecx' ] , BYTE ]
  , 0x4a: [ '_dec'      , [ 'dec'  , 'edx' ] , BYTE ]
  , 0x4b: [ '_dec'      , [ 'dec'  , 'ebx' ] , BYTE ]
  , 0x4c: [ '_dec'      , [ 'dec'  , 'esp' ] , BYTE ]
  , 0x4d: [ '_dec'      , [ 'dec'  , 'ebp' ] , BYTE ]
  , 0x4e: [ '_dec'      , [ 'dec'  , 'esi' ] , BYTE ]
  , 0x4f: [ '_dec'      , [ 'dec'  , 'edi' ] , BYTE ]
  , 0x50: [ '_push_reg' , [ 'push' , 'eax' ] , BYTE ]
  , 0x51: [ '_push_reg' , [ 'push' , 'ecx' ] , BYTE ]
  , 0x53: [ '_push_reg' , [ 'push' , 'ebx' ] , BYTE ]
  , 0x52: [ '_push_reg' , [ 'push' , 'edx' ] , BYTE ]
  , 0x54: [ '_push_reg' , [ 'push' , 'esp' ] , BYTE ]
  , 0x55: [ '_push_reg' , [ 'push' , 'ebp' ] , BYTE ]
  , 0x56: [ '_push_reg' , [ 'push' , 'esi' ] , BYTE ]
  , 0x57: [ '_push_reg' , [ 'push' , 'edi' ] , BYTE ]
  , 0xb0: [ '_movi'     , [ 'mov'  , 'al' ]  , BYTE ]
  , 0xb1: [ '_movi'     , [ 'mov'  , 'cl' ]  , BYTE ]
  , 0xb2: [ '_movi'     , [ 'mov'  , 'dl' ]  , BYTE ]
  , 0xb3: [ '_movi'     , [ 'mov'  , 'bl' ]  , BYTE ]
  , 0xb4: [ '_movi'     , [ 'mov'  , 'ah' ]  , BYTE ]
  , 0xb5: [ '_movi'     , [ 'mov'  , 'ch' ]  , BYTE ]
  , 0xb6: [ '_movi'     , [ 'mov'  , 'dh' ]  , BYTE ]
  , 0xb7: [ '_movi'     , [ 'mov'  , 'bh' ]  , BYTE ]
  , 0xb8: [ '_movi'     , [ 'mov'  , 'eax' ] , DWORD ]
  , 0xb9: [ '_movi'     , [ 'mov'  , 'ecx' ] , DWORD ]
  , 0xba: [ '_movi'     , [ 'mov'  , 'edx' ] , DWORD ]
  , 0xbb: [ '_movi'     , [ 'mov'  , 'ebx' ] , DWORD ]
  , 0xbc: [ '_movi'     , [ 'mov'  , 'esp' ] , DWORD ]
  , 0xbd: [ '_movi'     , [ 'mov'  , 'ebp' ] , DWORD ]
  , 0xbe: [ '_movi'     , [ 'mov'  , 'esi' ] , DWORD ]
  , 0xbf: [ '_movi'     , [ 'mov'  , 'edi' ] , DWORD ]
}

/**
 * Push 32 bit register onto stack.
 * [x50](http://ref.x86asm.net/coder32.html#x50)
 *
 * ```asm
 * 50   push   eax
 * 51   push   ecx
 * 53   push   ebx
 * 52   push   edx
 * 54   push   esp
 * 55   push   ebp
 * 56   push   esi
 * 57   push   edi
 * ```
 *
 * @name cu:_push_reg
 * @function
 * @param opcode
 */
proto._push_reg = function _push_reg(opcode, asm) {
  var regName = asm[1]
    , reg = this.regs[regName]; // eax, ebx, etc.
  this._push(reg);
}

/**
 * Decrement a register
 *
 * ```asm
 * 48   dec    eax
 * 49   dec    ecx
 * 4a   dec    edx
 * 4b   dec    ebx
 * 4c   dec    esp
 * 4d   dec    ebp
 * 4e   dec    esi
 * 4f   dec    edi
 * ```
 *
 * @name cu:: _dec
 * @function
 * @param opcode
 * @param asm
 */
proto._dec = function _dec(opcode, asm) {
  var regs = this.regs;
  var regName = asm[1]
  var res = this.alu.dec(regs[regName]);
  regs[regName] = res;

  return res === 0 ? this._setZF() : this._unsetZF();
}

proto._push = function _push(bytes) {
  var size = Array.isArray(bytes) ? bytes.length : 1;
  this.regs.esp = this.regs.esp - size;
  this.mem.store(this.regs.esp, bytes);
}

proto._movi = function _movi(opcode, asm, nbytes) {
  var regs = this.regs;
  var regName = asm[1]
  var imdBytes = this.mem.load(regs.eip, nbytes);
  var imd = leVal(imdBytes, nbytes);

  regs[regName] = imd;

  regs.eip += nbytes;
}

proto._setZF   = function _setZF() { this.regs.setFlag('ZF') }
proto._unsetZF = function _unsetZF() { this.regs.unsetFlag('ZF') }
