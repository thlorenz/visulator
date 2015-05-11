'use strict';

var xtend     = require('xtend')
  , hex       = require('../hexstring')
  , leVal     = require('../le-val')
  , parity    = require('../parity')
  , signed    = require('../signed')
  , auxiliary = require('../auxiliary')
  , debug     = require('debug')('cpu')
  , Memory    = require('./memory')
  , Regs      = require('./regs')
  , ALU       = require('./alu')

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

  var handler = decoded[0]
    , asm     = decoded[1]
    , nbytes  = decoded[2]

  // _opsizeOverride may have forced the size of this bytes used
  // for the instruction
  if (this._sizeOverride) {
    nbytes = this._sizeOverride
    this._sizeOverride = null
  }

  var asmString    = asm.join(' ')
    , nbytesString = nbytes === BYTE
      ? 'BYTE' : nbytes === WORD
      ? 'WORD' : 'DWORD'

  debug('opcode: %d', opcode)
  debug('%s\t %s\t; %s(\'%s\', [ %s ], %s)',
        opcodeString, asmString, handler, opcodeString, asm, nbytesString);
  this[handler](opcode, asm, nbytes)

  // in case we get an override opcode we have to
  // process the remaining part of the instruction
  // we call next() for simplicity, but it's actually not
  // a new cycle
  if (this._cycleIncomplete) {
    this._cycleIncomplete = false;
    this.next();
  }
}

var BYTE  = 1
  , WORD  = 2
  , DWORD = 4

//
// Instructions
//

proto._opcodeTable = {
    0x00: [  ] // not used
  , 0x48: [ '_dec'            , [ 'dec'      , 'eax'      ] , BYTE  ]
  , 0x49: [ '_dec'            , [ 'dec'      , 'ecx'      ] , BYTE  ]
  , 0x4a: [ '_dec'            , [ 'dec'      , 'edx'      ] , BYTE  ]
  , 0x4b: [ '_dec'            , [ 'dec'      , 'ebx'      ] , BYTE  ]
  , 0x4c: [ '_dec'            , [ 'dec'      , 'esp'      ] , BYTE  ]
  , 0x4d: [ '_dec'            , [ 'dec'      , 'ebp'      ] , BYTE  ]
  , 0x4e: [ '_dec'            , [ 'dec'      , 'esi'      ] , BYTE  ]
  , 0x4f: [ '_dec'            , [ 'dec'      , 'edi'      ] , BYTE  ]
  , 0x50: [ '_push_reg'       , [ 'push'     , 'eax'      ] , BYTE  ]
  , 0x51: [ '_push_reg'       , [ 'push'     , 'ecx'      ] , BYTE  ]
  , 0x53: [ '_push_reg'       , [ 'push'     , 'ebx'      ] , BYTE  ]
  , 0x52: [ '_push_reg'       , [ 'push'     , 'edx'      ] , BYTE  ]
  , 0x54: [ '_push_reg'       , [ 'push'     , 'esp'      ] , BYTE  ]
  , 0x55: [ '_push_reg'       , [ 'push'     , 'ebp'      ] , BYTE  ]
  , 0x56: [ '_push_reg'       , [ 'push'     , 'esi'      ] , BYTE  ]
  , 0x57: [ '_push_reg'       , [ 'push'     , 'edi'      ] , BYTE  ]
  , 0x66: [ '_opsizeOverride' , [ 'for'      , 'movi/r'   ] , WORD  ]
  , 0x88: [ '_movr'           , [ 'r1/8'     , 'r2/8'     ] , BYTE ]
  , 0x89: [ '_movr'           , [ 'r1/16/32' , 'r2/16/32' ] , DWORD ]
  , 0xb0: [ '_movi'           , [ 'mov'      , 'al'       ] , BYTE  ]
  , 0xb1: [ '_movi'           , [ 'mov'      , 'cl'       ] , BYTE  ]
  , 0xb2: [ '_movi'           , [ 'mov'      , 'dl'       ] , BYTE  ]
  , 0xb3: [ '_movi'           , [ 'mov'      , 'bl'       ] , BYTE  ]
  , 0xb4: [ '_movi'           , [ 'mov'      , 'ah'       ] , BYTE  ]
  , 0xb5: [ '_movi'           , [ 'mov'      , 'ch'       ] , BYTE  ]
  , 0xb6: [ '_movi'           , [ 'mov'      , 'dh'       ] , BYTE  ]
  , 0xb7: [ '_movi'           , [ 'mov'      , 'bh'       ] , BYTE  ]
  , 0xb8: [ '_movi'           , [ 'mov'      , 'eax'      ] , DWORD ]
  , 0xb9: [ '_movi'           , [ 'mov'      , 'ecx'      ] , DWORD ]
  , 0xba: [ '_movi'           , [ 'mov'      , 'edx'      ] , DWORD ]
  , 0xbb: [ '_movi'           , [ 'mov'      , 'ebx'      ] , DWORD ]
  , 0xbc: [ '_movi'           , [ 'mov'      , 'esp'      ] , DWORD ]
  , 0xbd: [ '_movi'           , [ 'mov'      , 'ebp'      ] , DWORD ]
  , 0xbe: [ '_movi'           , [ 'mov'      , 'esi'      ] , DWORD ]
  , 0xbf: [ '_movi'           , [ 'mov'      , 'edi'      ] , DWORD ]
}

/**
 * Used for any operation that operates on a register pair
 * mov, add, etc.
 *
 * Same code used no matter of the pair size dword, word.
 * For byte size general puropose regs we use @see _byteRegPair instead.
 *
 * Operations for smaller pairs just have a different
 * opcode than dword operations prefixing the pair.
 *
 * @name cu::_regPair
 */
proto._regPair = {
    0xc0 : [ 'eax', 'eax' ] , 0xc1 : [ 'ecx', 'eax' ] , 0xc2 : [ 'edx', 'eax' ] , 0xc3 : [ 'ebx', 'eax' ]
  , 0xc4 : [ 'esp', 'eax' ] , 0xc5 : [ 'ebp', 'eax' ] , 0xc6 : [ 'esi', 'eax' ] , 0xc7 : [ 'edi', 'eax' ]
  , 0xc8 : [ 'eax', 'ecx' ] , 0xc9 : [ 'ecx', 'ecx' ] , 0xca : [ 'edx', 'ecx' ] , 0xcb : [ 'ebx', 'ecx' ]
  , 0xcc : [ 'esp', 'ecx' ] , 0xcd : [ 'ebp', 'ecx' ] , 0xce : [ 'esi', 'ecx' ] , 0xcf : [ 'edi', 'ecx' ]
  , 0xd0 : [ 'eax', 'edx' ] , 0xd1 : [ 'ecx', 'edx' ] , 0xd2 : [ 'edx', 'edx' ] , 0xd3 : [ 'ebx', 'edx' ]
  , 0xd4 : [ 'esp', 'edx' ] , 0xd5 : [ 'ebp', 'edx' ] , 0xd6 : [ 'esi', 'edx' ] , 0xd7 : [ 'edi', 'edx' ]
  , 0xd8 : [ 'eax', 'ebx' ] , 0xd9 : [ 'ecx', 'ebx' ] , 0xda : [ 'edx', 'ebx' ] , 0xdb : [ 'ebx', 'ebx' ]
  , 0xdc : [ 'esp', 'ebx' ] , 0xdd : [ 'ebp', 'ebx' ] , 0xde : [ 'esi', 'ebx' ] , 0xdf : [ 'edi', 'ebx' ]
  , 0xe0 : [ 'eax', 'esp' ] , 0xe1 : [ 'ecx', 'esp' ] , 0xe2 : [ 'edx', 'esp' ] , 0xe3 : [ 'ebx', 'esp' ]
  , 0xe4 : [ 'esp', 'esp' ] , 0xe5 : [ 'ebp', 'esp' ] , 0xe6 : [ 'esi', 'esp' ] , 0xe7 : [ 'edi', 'esp' ]
  , 0xe8 : [ 'eax', 'ebp' ] , 0xe9 : [ 'ecx', 'ebp' ] , 0xea : [ 'edx', 'ebp' ] , 0xeb : [ 'ebx', 'ebp' ]
  , 0xec : [ 'esp', 'ebp' ] , 0xed : [ 'ebp', 'ebp' ] , 0xee : [ 'esi', 'ebp' ] , 0xef : [ 'edi', 'ebp' ]
  , 0xf0 : [ 'eax', 'esi' ] , 0xf1 : [ 'ecx', 'esi' ] , 0xf2 : [ 'edx', 'esi' ] , 0xf3 : [ 'ebx', 'esi' ]
  , 0xf4 : [ 'esp', 'esi' ] , 0xf5 : [ 'ebp', 'esi' ] , 0xf6 : [ 'esi', 'esi' ] , 0xf7 : [ 'edi', 'esi' ]
  , 0xf8 : [ 'eax', 'edi' ] , 0xf9 : [ 'ecx', 'edi' ] , 0xfa : [ 'edx', 'edi' ] , 0xfb : [ 'ebx', 'edi' ]
  , 0xfc : [ 'esp', 'edi' ] , 0xfd : [ 'ebp', 'edi' ] , 0xfe : [ 'esi', 'edi' ] , 0xff : [ 'edi', 'edi' ]
}

proto._byteRegPair = {
    0xc0 : [ 'al', 'al' ] , 0xc1 : [ 'cl', 'al' ] , 0xc2 : [ 'dl', 'al' ] , 0xc3 : [ 'bl', 'al' ]
  , 0xc4 : [ 'ah', 'al' ] , 0xc5 : [ 'ch', 'al' ] , 0xc6 : [ 'dh', 'al' ] , 0xc7 : [ 'bh', 'al' ]
  , 0xc8 : [ 'al', 'cl' ] , 0xc9 : [ 'cl', 'cl' ] , 0xca : [ 'dl', 'cl' ] , 0xcb : [ 'bl', 'cl' ]
  , 0xcc : [ 'ah', 'cl' ] , 0xcd : [ 'ch', 'cl' ] , 0xce : [ 'dh', 'cl' ] , 0xcf : [ 'bh', 'cl' ]
  , 0xd0 : [ 'al', 'dl' ] , 0xd1 : [ 'cl', 'dl' ] , 0xd2 : [ 'dl', 'dl' ] , 0xd3 : [ 'bl', 'dl' ]
  , 0xd4 : [ 'ah', 'dl' ] , 0xd5 : [ 'ch', 'dl' ] , 0xd6 : [ 'dh', 'dl' ] , 0xd7 : [ 'bh', 'dl' ]
  , 0xd8 : [ 'al', 'bl' ] , 0xd9 : [ 'cl', 'bl' ] , 0xda : [ 'dl', 'bl' ] , 0xdb : [ 'bl', 'bl' ]
  , 0xdc : [ 'ah', 'bl' ] , 0xdd : [ 'ch', 'bl' ] , 0xde : [ 'dh', 'bl' ] , 0xdf : [ 'bh', 'bl' ]
  , 0xe0 : [ 'al', 'ah' ] , 0xe1 : [ 'cl', 'ah' ] , 0xe2 : [ 'dl', 'ah' ] , 0xe3 : [ 'bl', 'ah' ]
  , 0xe4 : [ 'ah', 'ah' ] , 0xe5 : [ 'ch', 'ah' ] , 0xe6 : [ 'dh', 'ah' ] , 0xe7 : [ 'bh', 'ah' ]
  , 0xe8 : [ 'al', 'ch' ] , 0xe9 : [ 'cl', 'ch' ] , 0xea : [ 'dl', 'ch' ] , 0xeb : [ 'bl', 'ch' ]
  , 0xec : [ 'ah', 'ch' ] , 0xed : [ 'ch', 'ch' ] , 0xee : [ 'dh', 'ch' ] , 0xef : [ 'bh', 'ch' ]
  , 0xf0 : [ 'al', 'dh' ] , 0xf1 : [ 'cl', 'dh' ] , 0xf2 : [ 'dl', 'dh' ] , 0xf3 : [ 'bl', 'dh' ]
  , 0xf4 : [ 'ah', 'dh' ] , 0xf5 : [ 'ch', 'dh' ] , 0xf6 : [ 'dh', 'dh' ] , 0xf7 : [ 'bh', 'dh' ]
  , 0xf8 : [ 'al', 'bh' ] , 0xf9 : [ 'cl', 'bh' ] , 0xfa : [ 'dl', 'bh' ] , 0xfb : [ 'bl', 'bh' ]
  , 0xfc : [ 'ah', 'bh' ] , 0xfd : [ 'ch', 'bh' ] , 0xfe : [ 'dh', 'bh' ] , 0xff : [ 'bh', 'bh' ]
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
 * @name cu::_dec
 * @function
 * @param opcode
 * @param asm
 */
proto._dec = function _dec(opcode, asm) {
  var regs = this.regs;
  var regName = asm[1]
  var dst = regs[regName];
  var res = this.alu.dec(dst);
  regs[regName] = res;

  this._adjustFlags({ noModifyCarry: true, dst: dst, src: 1, res: res, sub: true });
}

proto._push = function _push(bytes) {
  var size = Array.isArray(bytes) ? bytes.length : 1;
  this.regs.esp = this.regs.esp - size;
  this.mem.store(this.regs.esp, bytes);
}

proto._movi = function _movi(opcode, asm, nbytes) {
  var regs = this.regs;
  // by default operates on entire dword register
  var regName = asm[1]

  // in case the size of the operation was overridden to word
  // operate on we operate only on the lower word of the register
  if (nbytes === WORD) regName = getWordRegName(regName);

  var imdBytes = this.mem.load(regs.eip, nbytes);
  var imd = leVal(imdBytes, nbytes);

  regs[regName] = imd;

  regs.eip += nbytes;
}

/**
 * Moves one register into another.
 * In order to execute this instruction we read the next code byte.
 * It tells us which register pairs are affected (i.e. which register
 * to move into which).
 *
 * We look these up via a table.
 *
 * @name cu::_movr
 * @function
 * @param {Number} opcode
 * @param {String} asm
 * @param {Number} nbytes the size of the (sub)register to move
 */
proto._movr = function _movr(opcode, asm, nbytes) {
  var regs = this.regs;

  var regPairCode = this.mem.load(regs.eip, BYTE)
    , regPair;

  switch(nbytes) {
    case WORD:
      regPair = this._regPair[regPairCode].map(getWordRegName)
      break
    case BYTE:
      regPair = this._byteRegPair[regPairCode]
      break
    default:  // dword
      regPair = this._regPair[regPairCode]
  }

  regs[regPair[0]] = regs[regPair[1]];
  regs.eip += BYTE;
}

function getWordRegName(name) {
  // eax -> ax
  debug('adapt reg name %s', name)
  return name.slice(1);
}

proto._opsizeOverride = function _opsizeOverride(opcode, asm, size) {
  this._sizeOverride = size
  this._cycleIncomplete = true;
}

proto._adjustFlags = function _adjustFlags(opts) {
  var res = opts.res;
  if (res === 0) this.regs.setFlag('ZF'); else this.regs.clearFlag('ZF');
  if (!parity(res)) this.regs.setFlag('PF'); else this.regs.clearFlag('PF');
  if (signed(res)) this.regs.setFlag('SF'); else this.regs.clearFlag('SF');
  if (auxiliary(opts.dst, opts.src, opts.sub)) this.regs.setFlag('AF'); else this.regs.clearFlag('AF');
  debug('adjusted flags to %s', this.regs.flagsToString())
}
