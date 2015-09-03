'use strict';

var instruction = require('../instruction')
  , cu_regName  = require('./cu.reg-name')
  , size        = require('../size')
  , BYTE        = size.BYTE
  , WORD        = size.WORD
  , DWORD       = size.DWORD

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
 * Certain operations like add/sub only use first reg of the pair, addressing
 * it via the pair code.
 * In that case the operation may also be encoded in the reg pair code, i.e.
 *
 * ```
 * add ecx, ...  ; 83 c1 ... uses c1 to indicate ecx
 * sub ecx, ...  ; 83 e9 ... uses e9 to indicate ecx
 * cmp ecx, ...  ; 83 f9 ... uses f9 to indicate ecx
 * ```
 *
 * @name cu::_dwordRegPair
 */
var dwordRegPair = exports.dwordRegPair = {
  // add
    0xc0 : [ 'eax', 'eax' ] , 0xc1 : [ 'ecx', 'eax' ] , 0xc2 : [ 'edx', 'eax' ] , 0xc3 : [ 'ebx', 'eax' ]
  , 0xc4 : [ 'esp', 'eax' ] , 0xc5 : [ 'ebp', 'eax' ] , 0xc6 : [ 'esi', 'eax' ] , 0xc7 : [ 'edi', 'eax' ]

  // or
  , 0xc8 : [ 'eax', 'ecx' ] , 0xc9 : [ 'ecx', 'ecx' ] , 0xca : [ 'edx', 'ecx' ] , 0xcb : [ 'ebx', 'ecx' ]
  , 0xcc : [ 'esp', 'ecx' ] , 0xcd : [ 'ebp', 'ecx' ] , 0xce : [ 'esi', 'ecx' ] , 0xcf : [ 'edi', 'ecx' ]

  // not
  , 0xd0 : [ 'eax', 'edx' ] , 0xd1 : [ 'ecx', 'edx' ] , 0xd2 : [ 'edx', 'edx' ] , 0xd3 : [ 'ebx', 'edx' ]
  , 0xd4 : [ 'esp', 'edx' ] , 0xd5 : [ 'ebp', 'edx' ] , 0xd6 : [ 'esi', 'edx' ] , 0xd7 : [ 'edi', 'edx' ]

  // neg
  , 0xd8 : [ 'eax', 'ebx' ] , 0xd9 : [ 'ecx', 'ebx' ] , 0xda : [ 'edx', 'ebx' ] , 0xdb : [ 'ebx', 'ebx' ]
  , 0xdc : [ 'esp', 'ebx' ] , 0xdd : [ 'ebp', 'ebx' ] , 0xde : [ 'esi', 'ebx' ] , 0xdf : [ 'edi', 'ebx' ]

  // and
  , 0xe0 : [ 'eax', 'esp' ] , 0xe1 : [ 'ecx', 'esp' ] , 0xe2 : [ 'edx', 'esp' ] , 0xe3 : [ 'ebx', 'esp' ]
  , 0xe4 : [ 'esp', 'esp' ] , 0xe5 : [ 'ebp', 'esp' ] , 0xe6 : [ 'esi', 'esp' ] , 0xe7 : [ 'edi', 'esp' ]

  // sub
  , 0xe8 : [ 'eax', 'ebp' ] , 0xe9 : [ 'ecx', 'ebp' ] , 0xea : [ 'edx', 'ebp' ] , 0xeb : [ 'ebx', 'ebp' ]
  , 0xec : [ 'esp', 'ebp' ] , 0xed : [ 'ebp', 'ebp' ] , 0xee : [ 'esi', 'ebp' ] , 0xef : [ 'edi', 'ebp' ]

  // xor
  , 0xf0 : [ 'eax', 'esi' ] , 0xf1 : [ 'ecx', 'esi' ] , 0xf2 : [ 'edx', 'esi' ] , 0xf3 : [ 'ebx', 'esi' ]
  , 0xf4 : [ 'esp', 'esi' ] , 0xf5 : [ 'ebp', 'esi' ] , 0xf6 : [ 'esi', 'esi' ] , 0xf7 : [ 'edi', 'esi' ]

  // cmp
  , 0xf8 : [ 'eax', 'edi' ] , 0xf9 : [ 'ecx', 'edi' ] , 0xfa : [ 'edx', 'edi' ] , 0xfb : [ 'ebx', 'edi' ]
  , 0xfc : [ 'esp', 'edi' ] , 0xfd : [ 'ebp', 'edi' ] , 0xfe : [ 'esi', 'edi' ] , 0xff : [ 'edi', 'edi' ]
}

/**
 * Used for byte sized operations on registers or a register pair.
 *
 * In case a register pair is used the names of both registers are provided.
 * In case only one register is used, the same code is used except we only use
 * the **first** register of the pair.
 *
 * @name cu::_byteRegPair
 */
var byteRegPair = exports.byteRegPair = {
  // add
    0xc0 : [ 'al', 'al' ] , 0xc1 : [ 'cl', 'al' ] , 0xc2 : [ 'dl', 'al' ] , 0xc3 : [ 'bl', 'al' ]
  , 0xc4 : [ 'ah', 'al' ] , 0xc5 : [ 'ch', 'al' ] , 0xc6 : [ 'dh', 'al' ] , 0xc7 : [ 'bh', 'al' ]

  // or
  , 0xc8 : [ 'al', 'cl' ] , 0xc9 : [ 'cl', 'cl' ] , 0xca : [ 'dl', 'cl' ] , 0xcb : [ 'bl', 'cl' ]
  , 0xcc : [ 'ah', 'cl' ] , 0xcd : [ 'ch', 'cl' ] , 0xce : [ 'dh', 'cl' ] , 0xcf : [ 'bh', 'cl' ]

  // not
  , 0xd0 : [ 'al', 'dl' ] , 0xd1 : [ 'cl', 'dl' ] , 0xd2 : [ 'dl', 'dl' ] , 0xd3 : [ 'bl', 'dl' ]
  , 0xd4 : [ 'ah', 'dl' ] , 0xd5 : [ 'ch', 'dl' ] , 0xd6 : [ 'dh', 'dl' ] , 0xd7 : [ 'bh', 'dl' ]

  // neg
  , 0xd8 : [ 'al', 'bl' ] , 0xd9 : [ 'cl', 'bl' ] , 0xda : [ 'dl', 'bl' ] , 0xdb : [ 'bl', 'bl' ]
  , 0xdc : [ 'ah', 'bl' ] , 0xdd : [ 'ch', 'bl' ] , 0xde : [ 'dh', 'bl' ] , 0xdf : [ 'bh', 'bl' ]

  // and
  , 0xe0 : [ 'al', 'ah' ] , 0xe1 : [ 'cl', 'ah' ] , 0xe2 : [ 'dl', 'ah' ] , 0xe3 : [ 'bl', 'ah' ]
  , 0xe4 : [ 'ah', 'ah' ] , 0xe5 : [ 'ch', 'ah' ] , 0xe6 : [ 'dh', 'ah' ] , 0xe7 : [ 'bh', 'ah' ]

  // sub
  , 0xe8 : [ 'al', 'ch' ] , 0xe9 : [ 'cl', 'ch' ] , 0xea : [ 'dl', 'ch' ] , 0xeb : [ 'bl', 'ch' ]
  , 0xec : [ 'ah', 'ch' ] , 0xed : [ 'ch', 'ch' ] , 0xee : [ 'dh', 'ch' ] , 0xef : [ 'bh', 'ch' ]

  // xor
  , 0xf0 : [ 'al', 'dh' ] , 0xf1 : [ 'cl', 'dh' ] , 0xf2 : [ 'dl', 'dh' ] , 0xf3 : [ 'bl', 'dh' ]
  , 0xf4 : [ 'ah', 'dh' ] , 0xf5 : [ 'ch', 'dh' ] , 0xf6 : [ 'dh', 'dh' ] , 0xf7 : [ 'bh', 'dh' ]

  // cmp
  , 0xf8 : [ 'al', 'bh' ] , 0xf9 : [ 'cl', 'bh' ] , 0xfa : [ 'dl', 'bh' ] , 0xfb : [ 'bl', 'bh' ]
  , 0xfc : [ 'ah', 'bh' ] , 0xfd : [ 'ch', 'bh' ] , 0xfe : [ 'dh', 'bh' ] , 0xff : [ 'bh', 'bh' ]
}

exports.getInstructionFromRegCode = function getInstructionFromRegCode(regCode) {
  // The actual operation add/sub/cmp/and is communicated via the code used
  // to indicate the register.
  if (regCode >= 0xf8) return instruction.cmp
  if (regCode >= 0xf0) return instruction.xor
  if (regCode >= 0xe8) return instruction.sub
  if (regCode >= 0xe0) return instruction.and
  if (regCode >= 0xd8) return instruction.neg
  if (regCode >= 0xd0) return instruction.not
  if (regCode >= 0xc8) return instruction.or
  return instruction.add
}

exports.getRegPair = function getRegPair(regPairCode, bytes) {
  switch(bytes) {
    case WORD:
      return dwordRegPair[regPairCode].map(cu_regName.getWordRegName)
      break
    case BYTE:
      return byteRegPair[regPairCode]
      break
    default:  // dword
      return dwordRegPair[regPairCode]
  }
}
