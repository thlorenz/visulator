'use strict';

function Registers() {
  if (!(this instanceof Registers)) return new Registers();
  this.eax = 0x0   // accumulator
  this.ebx = 0x0   // base register
  this.ecx = 0x0   // count register
  this.edx = 0x0   // data register
  this.esi = 0x0   // source index
  this.edi = 0x0   // destination index
  this.ebp = 0x0   // base pointer
  this.esp = 0x0   // stack pointer
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
 * Flags representation for each case of ONE flag set at a time.
 * Used to isolate each flag for flag operations
 *
 * see: [wiki flags register](http://en.wikipedia.org/wiki/FLAGS_register)
 * @name registers::_flagMasks
 * @function
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
  , IOPL1 : 0x00001000  // 0000 0000  0000 0000  0001 0000  0000 0000 -- only used on 286
  , IOPL3 : 0x00002000  // 0000 0000  0000 0000  0010 0000  0000 0000 -- only used on 286
  , NT    : 0x00004000  // 0000 0000  0000 0000  0100 0000  0000 0000
 // RES     0x00008000  // 0000 0000  0000 0000  1000 0000  0000 0000
  , RF    : 0x00010000  // 0000 0000  0000 0001  0000 0000  0000 0000
  , VM    : 0x00020000  // 0000 0000  0000 0010  0000 0000  0000 0000
  , AC    : 0x00040000  // 0000 0000  0000 0100  0000 0000  0000 0000
  , VIF   : 0x00080000  // 0000 0000  0000 1000  0000 0000  0000 0000
  , VIP   : 0x00100000  // 0000 0000  0001 0000  0000 0000  0000 0000
  , ID    : 0x00200000  // 0000 0000  0010 0000  0000 0000  0000 0000
  // all others reserved
}

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
  , IOPL3 : 13
  , NT    : 14
 // RES   : 15
  , RF    : 16
  , VM    : 17
  , AC    : 18
  , VIF   : 19
  , VIP   : 20
  , ID    : 21
}

proto.byte_l = {
    al: 'eax'
  , bl: 'ebx'
  , cl: 'ecx'
  , dl: 'edx'
}

proto.byte_h = {
    ah: 'eax'
  , bh: 'ebx'
  , ch: 'ecx'
  , dh: 'edx'
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
  this.eflags = this.eflags | this._flagMasks[flag];
}

/**
 * Unsets a given flag
 *
 * First we invert the mask for the flag to unset.
 * Then we `and` the flags with that mask which unsets
 * our flag since that's the only bit in the mask that's `0`.
 *
 * @name registers::unsetFlag
 * @function
 * @param flag
 */
proto.unsetFlag = function unsetFlag(flag) {
  this.eflags = this.eflags & !this._flagMasks[flag]; // XOR
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
