'use strict';
var size        = require('../size')
  , BYTE        = size.BYTE
  , WORD        = size.WORD
  , DWORD       = size.DWORD

//
// Instructions
//

module.exports = {
  // code:  method            , operation    , destination    , dst size , src size, override affects dst, src ]
    0x00: [       /* not used */                                  ]
  , 0x05: [ '_addsub_eax'      , [ 'add'      , 'eax'             ] , DWORD , DWORD , false , false ]
  , 0x08: [ '_orr'             , [ 'or'       , 'r8 - r8'         ] , BYTE  , BYTE  , false , false ]
  , 0x09: [ '_orr'             , [ 'or'       , 'r16/32 - r16/32' ] , DWORD , DWORD , false , false ]
  , 0x0c: [ '_ori_al'          , [ 'or al'    , 'r8'              ] , BYTE  , BYTE  , false , false ]
  , 0x0d: [ '_ori_eax'         , [ 'or eax'   , 'r16/32'          ] , DWORD , DWORD , true  , true  ]
  , 0x20: [ '_andr'            , [ 'and'      , 'r8 - r8'         ] , BYTE  , BYTE  , false , false ]
  , 0x21: [ '_andr'            , [ 'and'      , 'r16/32 - r16/32' ] , DWORD , DWORD , false , false ]
  , 0x24: [ '_andi_al'         , [ 'and al'   , 'r8'              ] , BYTE  , BYTE  , false , false ]
  , 0x25: [ '_andi_eax'        , [ 'and eax'  , 'r32'             ] , DWORD , DWORD , true  , true  ]
  , 0x2d: [ '_addsub_eax'      , [ 'sub'      , 'eax'             ] , DWORD , DWORD , false , false ]
  , 0x30: [ '_xorr'            , [ 'xor'      , 'r8 - r8'         ] , BYTE  , BYTE  , false , false ]
  , 0x31: [ '_xorr'            , [ 'xor'      , 'r16/32 - r16/32' ] , DWORD , DWORD , false , false ]
  , 0x34: [ '_xori_al'         , [ 'xor al'   , 'r8'              ] , BYTE  , BYTE  , false , false ]
  , 0x35: [ '_xori_eax'        , [ 'xor eax'  , 'r32'             ] , DWORD , DWORD , true  , true  ]
  , 0x40: [ '_inc'             , [ 'inc'      , 'eax'             ] , DWORD , null  , true  , false ]
  , 0x41: [ '_inc'             , [ 'inc'      , 'ecx'             ] , DWORD , null  , true  , false ]
  , 0x42: [ '_inc'             , [ 'inc'      , 'edx'             ] , DWORD , null  , true  , false ]
  , 0x43: [ '_inc'             , [ 'inc'      , 'ebx'             ] , DWORD , null  , true  , false ]
  , 0x44: [ '_inc'             , [ 'inc'      , 'esp'             ] , DWORD , null  , true  , false ]
  , 0x45: [ '_inc'             , [ 'inc'      , 'ebp'             ] , DWORD , null  , true  , false ]
  , 0x46: [ '_inc'             , [ 'inc'      , 'esi'             ] , DWORD , null  , true  , false ]
  , 0x47: [ '_inc'             , [ 'inc'      , 'edi'             ] , DWORD , null  , true  , false ]
  , 0x48: [ '_dec'             , [ 'dec'      , 'eax'             ] , DWORD , null  , true  , false ]
  , 0x49: [ '_dec'             , [ 'dec'      , 'ecx'             ] , DWORD , null  , true  , false ]
  , 0x4a: [ '_dec'             , [ 'dec'      , 'edx'             ] , DWORD , null  , true  , false ]
  , 0x4b: [ '_dec'             , [ 'dec'      , 'ebx'             ] , DWORD , null  , true  , false ]
  , 0x4c: [ '_dec'             , [ 'dec'      , 'esp'             ] , DWORD , null  , true  , false ]
  , 0x4d: [ '_dec'             , [ 'dec'      , 'ebp'             ] , DWORD , null  , true  , false ]
  , 0x4e: [ '_dec'             , [ 'dec'      , 'esi'             ] , DWORD , null  , true  , false ]
  , 0x4f: [ '_dec'             , [ 'dec'      , 'edi'             ] , DWORD , null  , true  , false ]
  , 0x50: [ '_push_reg'        , [ 'push'     , 'eax'             ] , DWORD , null  , false , false ]
  , 0x51: [ '_push_reg'        , [ 'push'     , 'ecx'             ] , DWORD , null  , false , false ]
  , 0x53: [ '_push_reg'        , [ 'push'     , 'ebx'             ] , DWORD , null  , false , false ]
  , 0x52: [ '_push_reg'        , [ 'push'     , 'edx'             ] , DWORD , null  , false , false ]
  , 0x54: [ '_push_reg'        , [ 'push'     , 'esp'             ] , DWORD , null  , false , false ]
  , 0x55: [ '_push_reg'        , [ 'push'     , 'ebp'             ] , DWORD , null  , false , false ]
  , 0x56: [ '_push_reg'        , [ 'push'     , 'esi'             ] , DWORD , null  , false , false ]
  , 0x57: [ '_push_reg'        , [ 'push'     , 'edi'             ] , DWORD , null  , false , false ]
  , 0x66: [ '_opsizeOverride'  , [ 'for'      , 'addi/movi/r'     ] , WORD  , null  , false , false ]
  , 0x80: [ '_logical_opi_wdw' , [ 'r/8'      , 'i/8'             ] , BYTE  , BYTE  , true  , false ]
  , 0x81: [ '_logical_opi_wdw' , [ 'r/32'     , 'i/32'            ] , DWORD , DWORD , true  , false ]
  , 0x83: [ '_logical_opi_wdw' , [ 'r/32/16'  , 'i/8'             ] , DWORD , BYTE  , true  , false ]
  , 0x88: [ '_movr'            , [ 'r1/8'     , 'r2/8'            ] , BYTE  , null  , true  , false ]
  , 0x89: [ '_movr'            , [ 'r1/16/32' , 'r2/16/32'        ] , DWORD , null  , true  , false ]
  , 0xa8: [ '_testi_al'        , [ 'test al'  , 'r8'              ] , BYTE  , BYTE  , false , false ]
  , 0xa9: [ '_testi_eax'       , [ 'test eax' , 'r16/32'          ] , DWORD , DWORD , true  , true ]
  , 0xb0: [ '_movi'            , [ 'mov'      , 'al'              ] , BYTE  , null  , true  , false ]
  , 0xb1: [ '_movi'            , [ 'mov'      , 'cl'              ] , BYTE  , null  , true  , false ]
  , 0xb2: [ '_movi'            , [ 'mov'      , 'dl'              ] , BYTE  , null  , true  , false ]
  , 0xb3: [ '_movi'            , [ 'mov'      , 'bl'              ] , BYTE  , null  , true  , false ]
  , 0xb4: [ '_movi'            , [ 'mov'      , 'ah'              ] , BYTE  , null  , true  , false ]
  , 0xb5: [ '_movi'            , [ 'mov'      , 'ch'              ] , BYTE  , null  , true  , false ]
  , 0xb6: [ '_movi'            , [ 'mov'      , 'dh'              ] , BYTE  , null  , true  , false ]
  , 0xb7: [ '_movi'            , [ 'mov'      , 'bh'              ] , BYTE  , null  , true  , false ]
  , 0xb8: [ '_movi'            , [ 'mov'      , 'eax'             ] , DWORD , null  , true  , false ]
  , 0xb9: [ '_movi'            , [ 'mov'      , 'ecx'             ] , DWORD , null  , true  , false ]
  , 0xba: [ '_movi'            , [ 'mov'      , 'edx'             ] , DWORD , null  , true  , false ]
  , 0xbb: [ '_movi'            , [ 'mov'      , 'ebx'             ] , DWORD , null  , true  , false ]
  , 0xbc: [ '_movi'            , [ 'mov'      , 'esp'             ] , DWORD , null  , true  , false ]
  , 0xbd: [ '_movi'            , [ 'mov'      , 'ebp'             ] , DWORD , null  , true  , false ]
  , 0xbe: [ '_movi'            , [ 'mov'      , 'esi'             ] , DWORD , null  , true  , false ]
  , 0xbf: [ '_movi'            , [ 'mov'      , 'edi'             ] , DWORD , null  , true  , false ]
  , 0xeb: [ '_jmp'             , [ 'jmp'      , 'i/8'             ] , BYTE  , BYTE  , false , false ]
  , 0xf6: [ '_not_neg'         , [ 'not/neg'  , 'r8'              ] , BYTE  , BYTE  , false , false ]
  , 0xf7: [ '_not_neg'         , [ 'not/neg'  , 'r16/32'          ] , DWORD , DWORD , true  , true  ]
  , 0xfe: [ '_inc_dec_b'       , [ 'inc/dec'  , 'r/8'             ] , BYTE  , false , false , false ]
}

/* Notes

*/
