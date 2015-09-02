'use strict';

var xtend          = require('xtend')
  , assert         = require('assert')
  , debug          = require('debug')('cpu')
  , hex            = require('../hexstring')
  , leVal          = require('../le-val')
  , parity         = require('../parity')
  , overflow       = require('../overflow')
  , signed         = require('../signed')
  , auxiliary      = require('../auxiliary')
  , size           = require('../size')
  , instruction    = require('../instruction')
  , Memory         = require('./memory')
  , Regs           = require('./regs')
  , ALU            = require('./alu')
  , cu_opcodeTable = require('./cu.opcode-table')
  , cu_regPair     = require('./cu.reg-pair')
  , cu_regName     = require('./cu.reg-name')
  , BYTE           = size.BYTE
  , WORD           = size.WORD
  , DWORD          = size.DWORD

function ControlUnit() {
  if (!(this instanceof ControlUnit)) return new ControlUnit();
  this.mem = new Memory();
  this.regs = new Regs();
  this.alu = new ALU(0xffffffff);
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
  this.instructionMeta = null;
  // fetch next instruction
  var codeAddr = this.regs.eip++;
  var opcode = this.mem.load(codeAddr, 1)[0]
    , opcodeString = hex(opcode || 0)

  var decoded = cu_opcodeTable[opcode]
  if (!decoded) return debug('Unknown opcode %s', opcodeString);

  var handler     = decoded[0]
    , asm         = decoded[1]
    , dstbytes    = decoded[2]   // only used for some instructions
    , srcbytes    = decoded[3]
    , overrideDst = !!decoded[4]
    , overrideSrc = !!decoded[5]

  // _opsizeOverride overrides dst or src size of operation
  // depending on the instruction
  if (this._sizeOverride) {
    if (overrideDst && overrideSrc) {
      dstbytes = WORD;
      srcbytes = WORD;
    } else if (overrideDst) {
      dstbytes = WORD;
    } else {
      srcbytes = WORD;
    }
    this._sizeOverride = null
  }

  var asmString  = asm.join(' ');

  debug('opcode: %d', opcode)
  debug('%s\t %s\t; %s(\'%s\', [ %s ], %s, %s)',
        opcodeString, asmString, handler, opcodeString, asm,
        size.toString(dstbytes), size.toString(srcbytes));
  this[handler](opcode, asm, dstbytes, srcbytes)

  // in case we get an override opcode we have to
  // process the remaining part of the instruction
  // we call next() for simplicity, but it's actually not
  // a new cycle
  if (this._cycleIncomplete) {
    this._cycleIncomplete = false;
    this.next();
  }
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

  this.instructionMeta = {
     op : instruction.push
  }
}

/**
 * Inccrement a register
 *
 * @name cu::_inc
 * @function
 * @param opcode
 * @param asm
 * @param srcbytes
 * @param dstbytes
 */
proto._inc = function _inc(opcode, asm, dstbytes, srcbytes) {
  this.__inc_dec(opcode, asm, srcbytes, false)
}

/**
 * Decrement a register
 *
 * @name cu::_dec
 * @function
 * @param opcode
 * @param asm
 * @param srcbytes
 * @param dstbytes
 */
proto._dec = function _dec(opcode, asm, dstbytes, srcbytes) {
  this.__inc_dec(opcode, asm, srcbytes, true)
}

proto.__inc_dec = function _inc_dec(opcode, asm, srcbytes, sub) {
  var regs = this.regs
    , regName

  switch(srcbytes) {
    case WORD:
      regName = cu_regName.getWordRegName(asm[1])
      break
    case BYTE:
      throw new Error('BYTE inc/dec ops are handled by _inc_dec_b')
      break
    default:
      regName = asm[1]
  }

  var dst = regs[regName];
  var res = sub
    ? this.alu.dec(dst, srcbytes)
    : this.alu.inc(dst, srcbytes);

  regs[regName] = res;

  this._updateMetaAndFlags({
      dst      : dst
    , src      : 1
    , bytes    : srcbytes
    , op       : sub ? instruction.dec : instruction.inc
    , res      : res
    , sub      : sub
    , noModCF  : true
  })
}

proto._inc_dec_b = function _inc_dec(opcode, asm, dstbytes, srcbytes) {
  assert(srcbytes === BYTE, 'this only handles BYTE sized inc/dec ops')
  var regs = this.regs
    , regCode = this.mem.load(regs.eip, BYTE)
    , regName = cu_regPair.byteRegPair[regCode][0];

  // the regcode also dictates inc vs. dec
  // i.e. 0xc4 and 0xcc both have 'ah' as first reg name
  // 0xc4 means 'inc ah', 0xcc means 'dec ah'
  var sub = regCode >= 0xc8;
  var dst = regs[regName]
  var res = sub
    ? this.alu.dec(dst, srcbytes)
    : this.alu.inc(dst, srcbytes)

  regs[regName] = res;

  this._updateMetaAndFlags({
      dst      : dst
    , src      : 1
    , bytes    : srcbytes
    , op       : sub ? instruction.dec : instruction.inc
    , res      : res
    , sub      : sub
    , noModCF  : true
  })

  regs.eip += BYTE
}

proto._addsub_eax = function _addsub_eax(opcode, asm, dstbytes, srcbytes) {
  var src = leVal(this.mem.load(this.regs.eip, srcbytes))
    , dst = srcbytes === DWORD ? this.regs.eax : this.regs.ax
    , sub = opcode === 0x2d
    , cmp = opcode === 0xf8

  var res = sub
    ? this.alu.sub(dst, src, dstbytes)
    : this.alu.add(dst, src, dstbytes)

  if (!cmp) {
    if (srcbytes === DWORD) this.regs.eax = res
    else this.regs.ax = res
  }

  this._updateMetaAndFlags({
      dst     : dst
    , src     : src
    , bytes   : srcbytes
    , op      : sub ? instruction.sub : instruction.add
    , res     : res
    , sub     : sub
  })

  this.regs.eip += srcbytes;
}

proto._andi_al = function _andi_al(opcode, asm, dstbytes, srcbytes) {
  this.__logical_opi_eaxl(dstbytes, srcbytes, instruction.and)
}

proto._andi_eax = function _andi_eax(opcode, asm, dstbytes, srcbytes) {
  this.__logical_opi_eaxl(dstbytes, srcbytes, instruction.and)
}

proto._andr = function _andr(opcode, asm, dstbytes, srcbytes) {
  this.__logical_opr(dstbytes, srcbytes, instruction.and)
}

proto._orr = function _orr(opcode, asm, dstbytes, srcbytes) {
  this.__logical_opr(dstbytes, srcbytes, instruction.or)
}

proto._ori_al = function _ori_al(opcode, asm, dstbytes, srcbytes) {
  this.__logical_opi_eaxl(dstbytes, srcbytes, instruction.or)
}

proto._ori_eax = function _ori_eax(opcode, asm, dstbytes, srcbytes) {
  this.__logical_opi_eaxl(dstbytes, srcbytes, instruction.or)
}

proto.__logical_opr = function __logical_opr(dstbytes, srcbytes, op) {
  var regs = this.regs;

  var regPairCode = this.mem.load(regs.eip, BYTE)
  var regPair = cu_regPair.getRegPair(regPairCode, srcbytes)

  var dst = regs[regPair[0]]
    , src = regs[regPair[1]]
    , res = this.alu[op.name](dst, src, dstbytes)

  this._updateMetaAndFlags({
      dst    : dst
    , src    : src
    , bytes  : dstbytes
    , op     : op
    , res    : res
  })

  regs[regPair[0]] = res
  regs.eip += BYTE;
}

proto.__logical_opi_eaxl = function _op_eaxl(dstbytes, srcbytes, op) {
  // 0x0c: `or  al, ..`
  // 0x0d: `or  eax, ..`
  // 0x24: `and al, ..`
  var regs    = this.regs
  var src = leVal(this.mem.load(regs.eip, srcbytes))
  var regname = dstbytes === BYTE ? 'al' : dstbytes === WORD ? 'ax' : 'eax'
  var dst = regs[regname]

  var res = this.alu[op.name](dst, src, dstbytes)
  regs[regname] = res
  regs.eip += srcbytes

  this._updateMetaAndFlags({
      dst    : dst
    , src    : src
    , bytes  : dstbytes
    , op     : op
    , res    : res
  })
}

// TODO: change name to reflect all ops covered by the opcode
proto._addsubiw_dw = function _addsubiw_dw(opcode, asm, dstbytes, srcbytes) {
  var regs    = this.regs
    , regCode = this.mem.load(regs.eip, BYTE)

  // Note that cmp substracts in order to determine the flags but
  // doesn't store the result in the target
  var inst = cu_regPair.getInstructionFromRegCode(regCode)
  debug({ instruction: inst.name })

  regs.eip += BYTE

  // opcode: 0x81 is used both for adding/substracting WORD to cx and DWORD to ecx, etc.
  if (dstbytes === WORD && srcbytes === DWORD) srcbytes = WORD;

  // eax, ecx, edx, ebx use byte pairs others don't
  var regName = dstbytes === BYTE // && regCode < 0xc4
      ? cu_regPair.byteRegPair[regCode][0]
      : cu_regPair.dwordRegPair[regCode][0]

  // this version of addi always assigns to the dword register
  // TODO not true for _addiw
  regName = dstbytes === DWORD ? cu_regName.getDWordRegName(regName)
          : dstbytes === WORD  ? cu_regName.getWordRegName(regName)
          : regName

  var dst = regs[regName]
    , src = leVal(this.mem.load(regs.eip, srcbytes))
    , sub = false
  regs.eip += srcbytes

  debug({ regName: regName })
  var res;
  // no matter what the size of src, size of dst is considered
  // when determining overflow
  switch (inst.name) {
    case 'cmp':
      res = this.alu.sub(dst, src, dstbytes)
      // cmp doesn't assign result to destination
      sub = true
      break
    case 'sub':
      res = this.alu.sub(dst, src, dstbytes)
      regs[regName] = res
      sub = true
      break
    case 'add':
      res = this.alu.add(dst, src, dstbytes)
      regs[regName] = res
      break
    case 'and':
      res = this.alu.and(dst, src, dstbytes)
      regs[regName] = res
      break;
    case 'or':
      // handles a special case in which
      // or 'ecx, 0xffffffff' becomes '83 c9 ff'
      // more info see test/fixtures/ori_w.asm and http://sandpile.org/x86/opc_enc.html
      if (srcbytes < dstbytes && src >= 0x88)
        src = fill(dstbytes, srcbytes, src)

      res = this.alu.or(dst, src, dstbytes)
      regs[regName] = res
      break;
  }

  this._updateMetaAndFlags({
      dst   : dst
    , src   : src
    , bytes : dstbytes
    , op    : inst
    , res   : res
    , sub   : sub
  })
}

function fill(from, to, val) {
  debug({ from: hex(from), to: hex(to), val: hex(val) })
  switch(from - to) {
    case 3: return val + 0xffffff00
    case 2: return val + 0x00ffff00
    case 1: return val + 0x0000ff00
    case 0: return val;
    default:
      throw new Error('Cannot fill from: ' + from +
                      ' to: ' + to +  ' (for ' + val + ')')
  }
}

proto._push = function _push(bytes) {
  var size = Array.isArray(bytes) ? bytes.length : 1;
  this.regs.esp = this.regs.esp - size;
  this.mem.store(this.regs.esp, bytes);

  this.instructionMeta = {
     op : instruction.push
  }
}

proto._movi = function _movi(opcode, asm, dstbytes, srcbytes) {
  var regs = this.regs;
  // by default operates on entire dword register
  var regName = asm[1]

  // in case the size of the operation was overridden to word
  // operate on we operate only on the lower word of the register
  if (srcbytes === WORD) regName = cu_regName.getWordRegName(regName);

  var imdBytes = this.mem.load(regs.eip, srcbytes);
  var imd = leVal(imdBytes, srcbytes);

  this.instructionMeta = {
      op    : instruction.mov
    , dst   : regs[regName]
    , bytes : srcbytes
    , src   : imd
    , res   : imd
  }

  regs[regName] = imd;

  regs.eip += srcbytes;

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
 * @param {Number} srcbytes the size of the (sub)register to move
 */
proto._movr = function _movr(opcode, asm, dstbytes, srcbytes) {
  var regs = this.regs;

  var regPairCode = this.mem.load(regs.eip, BYTE)
  var regPair = cu_regPair.getRegPair(regPairCode, srcbytes)

  this.instructionMeta = {
      op    : instruction.mov
    , dst   : regs[regPair[0]]
    , src   : regs[regPair[1]]
    , res   : regs[regPair[1]]
    , bytes : srcbytes
  }

  regs[regPair[0]] = regs[regPair[1]];
  regs.eip += BYTE;
}

proto._jmp = function _jmp(opcode, asm, dstbytes, srcbytes) {
  var regs = this.regs
    , res;

  var distanceBytes = this.mem.load(regs.eip, srcbytes);
  var distance = leVal(distanceBytes, srcbytes);
  regs.eip += srcbytes;

  if (distance < 0x80) res = this.regs.eip + distance;
  else {
    distance = (distance ^ 0xff) + 0x01;
    res = regs.eip - distance;
  }


  this.instructionMeta = {
      op    : instruction.jmp
    , dst   : this.regs.eip
    , src   : distance
    , res   : res
    , bytes : srcbytes
  }

  regs.eip = res;
}

proto._opsizeOverride = function _opsizeOverride(opcode, asm, size) {
  this._sizeOverride = true;
  this._cycleIncomplete = true;
}

proto._updateMetaAndFlags = function _updateMetaAndFlags(opts) {
  this.instructionMeta = {
      dst    : opts.dst
    , src    : opts.src
    , bytes  : opts.bytes
    , res    : opts.res
    , op     : opts.op
  }
  this._adjustFlags({
      dst     : opts.dst
    , src     : opts.src
    , bytes   : opts.bytes
    , res     : opts.res
    , sub     : opts.sub
    , op      : opts.op
    , noModCF : opts.noModCF
  })
}

proto._adjustFlags = function _adjustFlags(opts) {
  var res = opts.res;
  var ZF = res === 0
    , OF = !opts.sub && overflow(opts.src, opts.dst, opts.res, opts.bytes)
    , SF = signed(res, opts.bytes)
    , PF = parity(res, true) === 1
    , AF = auxiliary(opts.dst, opts.src, opts.op, opts.sub)
    , CF = this.alu.carried

  debug({
      bytes   : opts.bytes
    , dst     : hex(opts.dst)
    , src     : hex(opts.src)
    , res     : hex(opts.res)
    , sub     : opts.sub
    , noModCF : opts.noModCF
  })

  if (!opts.noModCF)
    if (CF) this.regs.setFlag('CF'); else this.regs.clearFlag('CF');

  if (ZF) this.regs.setFlag('ZF'); else this.regs.clearFlag('ZF');
  if (OF) this.regs.setFlag('OF'); else this.regs.clearFlag('OF');
  if (SF) this.regs.setFlag('SF'); else this.regs.clearFlag('SF');
  if (PF) this.regs.setFlag('PF'); else this.regs.clearFlag('PF');
  if (AF) this.regs.setFlag('AF'); else this.regs.clearFlag('AF');
  debug('adjusted flags to %s', this.regs.flagsToString())
}
