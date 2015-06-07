'use strict';
var leVal = require('../le-val')
  , leBytes = require('../le-bytes')
  , hex = require('../hexstring')
  , debug = require('debug')('reg')

function Registers() {
  if (!(this instanceof Registers)) return new Registers();

  [ // general purpose registers
    'eax', 'ebx', 'ecx', 'edx',
    // load/store registers
    'esi', 'edi',
    // stack pointers
    'ebp', 'esp',
    // program counter
    'eip'
  ].forEach(this._createRegister, this);

  this.eax = 0x0   // accumulator
  this.ebx = 0x0   // base register
  this.ecx = 0x0   // count register
  this.edx = 0x0   // data register

  this.esi = 0x0   // source index
  this.edi = 0x0   // destination index

  this.ebp = 0x0   // base pointer
  this.esp = 0x0   // stack pointer

  // program counter
  this.eip = 0x0   // instruction pointer

//   'CF', '', 'PF', '', 'AF', '', 'ZF', 'SF', 'TF', 'IF', 'DF', 'OF', 'IOPL',
//    0     1   2     3   4     5   6     7     8     9     10    11    12
//  'IOPL', 'NT', '', 'RF', 'VM', 'AC', 'VIF', 'VIP', 'ID'
//   13      14    15  16    17    18    19     20     21
  this.eflags = 0x202 // [ IF ]
}

var proto = Registers.prototype;
module.exports = Registers;

/**
 * Registers are stored as a 4 byte array in order to allow
 * accessing sub registers like ax, ah and al easily.
 *
 * The byte order is little endian to be consistent with how things are
 * stored in memory and thus be able to use the same store/load functions
 * we use for the latter.
 *
 * As an example **eax** is stored as follows:
 *
 * ```js
 * this._eax = [
 *     0x0 // al
 *   , 0x0 // ah
 *   , 0x0 // lower byte of upper word
 *   , 0x0 // upper byte of upper word
 * ]
 * ```
 *
 * Each register part can be accessed via a property, i.e. regs.ah, regs.ax.
 *
 * @name registers::_createRegister
 * @function
 * @param {String} k the name of the register
 */
proto._createRegister = function _createRegister(k) {
  var isGeneralPurpose = k[2] === 'x';

  var field    = '_' + k;
  var lowWord  = k[1] + k[2]; // ax, di, etc.
  var lowByte  = k[1] + 'l';  // al - not addressable for edi, ebp, etc.
  var highByte = k[1] + 'h';  // ah - not addressable for edi, ebp, etc.

  // eax, edi, ebp, etc.
  Object.defineProperty(this, k, {
      get: function getEax()    { return leVal(this[field], 4) }
    , set: function setEax(val) { this[field] = leBytes(val, 4) }
  })

  // ax
  Object.defineProperty(this, lowWord, {
      get: function getAx() {
        var bytes = [
          this[field][0]  // al
        , this[field][1]  // ah
        ]
        return leVal(bytes, 2)
      }
    , set: function setAx(val) {
        var bytes = leBytes(val, 2)
        this[field][0] = bytes[0]
        this[field][1] = bytes[1]
      }
  })

  // the lowest two bytes can be addressed separately
  // only for general purpose registers
  if (!isGeneralPurpose) return;

  // ah
  Object.defineProperty(this, highByte, {
      get: function getAh() {
        return this[field][1]
      }
    , set: function setAh(val) {
        var bytes = leBytes(val, 1)
        this[field][1] = bytes[0]
      }
  })

  // al
  Object.defineProperty(this, lowByte, {
      get: function getAl() {
        return this[field][0]
      }
    , set: function setAl(val) {
        var bytes = leBytes(val, 1)
        this[field][0] = bytes[0]
    }
  })
}

/**
 * Flags representation for each case of ONE flag set at a time.
 * Used to isolate each flag for flag operations
 *
 * **Flag's Meanings**
 *
 * - CF: *carry flag* set if the result of an add or shift operation carries out a bit beyond the destination operand;
 *   otherwise cleared
 * - PF: *parity flag* set if the number of 1-bits in the low byte of the result is even,
 *   otherwise cleared
 * - AF: *adjust flag* auxiliary carry used for 4-bit BCD math,
 *   set when an operation causes a carry out of a 4-bit BCD quantity
 * - ZF: *zero flag* set if the result of an operation is zero, otherwise cleared
 * - TF: *trap flag* for debuggers, permits operation of a processor in single-step mode
 * - SF: *sign flag* set when the sign of the result forces the destination operand to become negative,
 *   i.e. its most significant bit is set
 * - IF: *interrupt enable flag* determines whether or not the CPU
 *   will handle maskable hardware interrupts
 * - DF: *direction flag* controls the left-to-right or right-to-left direction of string processing
 * - OF: *overflow flag* set if the result is too large to fit in the destination operand
 *
 * see: [wiki flags register](http://en.wikipedia.org/wiki/FLAGS_register)
 * @name registers::_flagMasks
 */
proto._flagMasks = {
    CF    : 0x00000001  // 0000 0000  0000 0000  0000 0000  0000 0001
 // RES     0x00000002  // 0000 0000  0000 0000  0000 0000  0000 0010
  , PF:     0x00000004  // 0000 0000  0000 0000  0000 0000  0000 0100
 // RES     0x00000008  // 0000 0000  0000 0000  0000 0000  0000 1000
  , AF    : 0x00000010  // 0000 0000  0000 0000  0000 0000  0001 0000
 // RES     0x00000020  // 0000 0000  0000 0000  0000 0000  0010 0000
  , ZF    : 0x00000040  // 0000 0000  0000 0000  0000 0000  0100 0000
  , SF    : 0x00000080  // 0000 0000  0000 0000  0000 0000  1000 0000
  , TF    : 0x00000100  // 0000 0000  0000 0000  0000 0001  0000 0000
  , IF    : 0x00000200  // 0000 0000  0000 0000  0000 0010  0000 0000
  , DF    : 0x00000400  // 0000 0000  0000 0000  0000 0100  0000 0000
  , OF    : 0x00000800  // 0000 0000  0000 0000  0000 1000  0000 0000
  , IOPL1 : 0x00001000  // 0000 0000  0000 0000  0001 0000  0000 0000 -- I/O privilege level (286+ only), always 1 on 8086 and 186
  , IOPL2 : 0x00002000  // 0000 0000  0000 0000  0010 0000  0000 0000
  , NT    : 0x00004000  // 0000 0000  0000 0000  0100 0000  0000 0000 -- Nested task flag (286+ only), always 1 on 8086 and 186
 // RES     0x00008000  // 0000 0000  0000 0000  1000 0000  0000 0000
  , RF    : 0x00010000  // 0000 0000  0000 0001  0000 0000  0000 0000 -- Resume flag (386+ only)
  , VM    : 0x00020000  // 0000 0000  0000 0010  0000 0000  0000 0000 -- Virtual 8086 mode flag (386+ only)
  , AC    : 0x00040000  // 0000 0000  0000 0100  0000 0000  0000 0000 -- Alignment check (486SX+ only)
  , VIF   : 0x00080000  // 0000 0000  0000 1000  0000 0000  0000 0000 -- Virtual interrupt flag (Pentium+)
  , VIP   : 0x00100000  // 0000 0000  0001 0000  0000 0000  0000 0000 -- Virtual interrupt pending (Pentium+)
  , ID    : 0x00200000  // 0000 0000  0010 0000  0000 0000  0000 0000 -- Able to use CPUID instruction (Pentium+)
  // all others reserved
}

/**
 * Index of each flag in the eflags register.
 *
 * @name registers::_flagIndexes
 */
proto._flagIndexes = {
    CF    : 0
 // RES   : 1
  , PF    : 2
 // RES   : 3
  , AF    : 4
 // RES   : 5
  , ZF    : 6
  , SF    : 7
  , TF    : 8
  , IF    : 9
  , DF    : 10
  , OF    : 11
  , IOPL1 : 12
  , IOPL2 : 13
  , NT    : 14
 // RES   : 15
  , RF    : 16
  , VM    : 17
  , AC    : 18
  , VIF   : 19
  , VIP   : 20
  , ID    : 21
}

/**
 * Returns a given flag
 *
 *  First masks out the bit of the flag we are interested in
 *  and then shifts our flag bit into lowest bit.
 * @name registers::getFlag
 * @function
 * @param flag
 * @return {Number} `1` if flag is set, otherwise `0`
 */
proto.getFlag = function getFlag(flag) {
  return (this.eflags & this._flagMasks[flag]) >> this._flagIndexes[flag];
}

/**
 * Sets a given flag
 *
 *  `or`s flags with mask that will preserve all other flags and set
 *  our flag since that bit is set in the mask.
 *
 * @name registers::setFlag
 * @function
 * @param flag
 */
proto.setFlag = function setFlag(flag) {
  this.eflags = this.eflags | this._flagMasks[flag]
}

proto.isFlagSet = function isFlagSet(flag) {
  return this.eflags & this._flagMasks[flag];
}

/**
 * Clears a given flag
 *
 * First we invert the mask for the flag to clear.
 * Then we `and` the flags with that mask which clears
 * our flag since that's the only bit in the mask that's `0`.
 *
 * @name registers::clearFlag
 * @function
 * @param flag
 */
proto.clearFlag = function clearFlag(flag) {
  this.eflags = this.eflags & ~this._flagMasks[flag]; // XOR
}

proto.flagsToString = function flagsToString() {
  var self = this;
  function toFlagsArray(acc, k) {
    if (self.isFlagSet(k)) acc.push(k);
    return acc;
  }
  return ' [ ' + Object.keys(this._flagMasks)
    .reduce(toFlagsArray, [])
    .join(', ') + ' ]'
}

/**
 * Assigns given registers with the supplied values.
 * Leaves all other flags alone.
 *
 * @name registers::assign
 * @function
 * @param regs
 */
proto.assign = function assign(regs) {
  /* jslint validthis:true */
  function setReg(k) { this[k] = regs[k] }
  Object.keys(regs).forEach(setReg, this);
}
