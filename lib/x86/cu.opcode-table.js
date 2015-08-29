'use strict';
var size        = require('../size')
  , BYTE        = size.BYTE
  , WORD        = size.WORD
  , DWORD       = size.DWORD

//
// Instructions
//

module.exports = {
  // code:  method            , operation    , destination    , dst size , src size, override affects dst ]
    0x00: [                                                      ] // not used
  , 0x05: [ '_addsub_eax'     , [ 'add'      , 'eax'             ] , DWORD , DWORD                   ]
  , 0x0c: [ '_ori_al'         , [ 'or al'    , 'r8'              ] , BYTE  , BYTE                    ]
  , 0x20: [ '_andr'           , [ 'and'      , 'r8 - r8'         ] , BYTE  , BYTE                    ]
  , 0x21: [ '_andr'           , [ 'and'      , 'r16/32 - r16/32' ] , DWORD , DWORD                   ]
  , 0x24: [ '_andi_al'        , [ 'and al'   , 'r8'              ] , BYTE  , BYTE                    ]
  , 0x2d: [ '_addsub_eax'     , [ 'sub'      , 'eax'             ] , DWORD , DWORD                   ]
  , 0x40: [ '_inc'            , [ 'inc'      , 'eax'             ] , null  , DWORD                   ]
  , 0x41: [ '_inc'            , [ 'inc'      , 'ecx'             ] , null  , DWORD                   ]
  , 0x42: [ '_inc'            , [ 'inc'      , 'edx'             ] , null  , DWORD                   ]
  , 0x43: [ '_inc'            , [ 'inc'      , 'ebx'             ] , null  , DWORD                   ]
  , 0x44: [ '_inc'            , [ 'inc'      , 'esp'             ] , null  , DWORD                   ]
  , 0x45: [ '_inc'            , [ 'inc'      , 'ebp'             ] , null  , DWORD                   ]
  , 0x46: [ '_inc'            , [ 'inc'      , 'esi'             ] , null  , DWORD                   ]
  , 0x47: [ '_inc'            , [ 'inc'      , 'edi'             ] , null  , DWORD                   ]
  , 0x48: [ '_dec'            , [ 'dec'      , 'eax'             ] , null  , DWORD                   ]
  , 0x49: [ '_dec'            , [ 'dec'      , 'ecx'             ] , null  , DWORD                   ]
  , 0x4a: [ '_dec'            , [ 'dec'      , 'edx'             ] , null  , DWORD                   ]
  , 0x4b: [ '_dec'            , [ 'dec'      , 'ebx'             ] , null  , DWORD                   ]
  , 0x4c: [ '_dec'            , [ 'dec'      , 'esp'             ] , null  , DWORD                   ]
  , 0x4d: [ '_dec'            , [ 'dec'      , 'ebp'             ] , null  , DWORD                   ]
  , 0x4e: [ '_dec'            , [ 'dec'      , 'esi'             ] , null  , DWORD                   ]
  , 0x4f: [ '_dec'            , [ 'dec'      , 'edi'             ] , null  , DWORD                   ]
  , 0x50: [ '_push_reg'       , [ 'push'     , 'eax'             ] , null  , BYTE                    ]
  , 0x51: [ '_push_reg'       , [ 'push'     , 'ecx'             ] , null  , BYTE                    ]
  , 0x53: [ '_push_reg'       , [ 'push'     , 'ebx'             ] , null  , BYTE                    ]
  , 0x52: [ '_push_reg'       , [ 'push'     , 'edx'             ] , null  , BYTE                    ]
  , 0x54: [ '_push_reg'       , [ 'push'     , 'esp'             ] , null  , BYTE                    ]
  , 0x55: [ '_push_reg'       , [ 'push'     , 'ebp'             ] , null  , BYTE                    ]
  , 0x56: [ '_push_reg'       , [ 'push'     , 'esi'             ] , null  , BYTE                    ]
  , 0x57: [ '_push_reg'       , [ 'push'     , 'edi'             ] , null  , BYTE                    ]
  , 0x66: [ '_opsizeOverride' , [ 'for'      , 'addi/movi/r'     ] , null  , WORD                    ]
  , 0x80: [ '_addsubiw_dw'    , [ 'r/32'     , 'i/32'            ] , BYTE  , BYTE                      , true ]
  , 0x81: [ '_addsubiw_dw'    , [ 'r/32'     , 'i/32'            ] , DWORD , DWORD                     , true ]
  , 0x83: [ '_addsubiw_dw'    , [ 'r/32/16'  , 'i/8'             ] , DWORD , BYTE                      , true ]
  , 0x88: [ '_movr'           , [ 'r1/8'     , 'r2/8'            ] , null  , BYTE                    ]
  , 0x89: [ '_movr'           , [ 'r1/16/32' , 'r2/16/32'        ] , null  , DWORD                   ]
  , 0xb0: [ '_movi'           , [ 'mov'      , 'al'              ] , null  , BYTE                    ]
  , 0xb1: [ '_movi'           , [ 'mov'      , 'cl'              ] , null  , BYTE                    ]
  , 0xb2: [ '_movi'           , [ 'mov'      , 'dl'              ] , null  , BYTE                    ]
  , 0xb3: [ '_movi'           , [ 'mov'      , 'bl'              ] , null  , BYTE                    ]
  , 0xb4: [ '_movi'           , [ 'mov'      , 'ah'              ] , null  , BYTE                    ]
  , 0xb5: [ '_movi'           , [ 'mov'      , 'ch'              ] , null  , BYTE                    ]
  , 0xb6: [ '_movi'           , [ 'mov'      , 'dh'              ] , null  , BYTE                    ]
  , 0xb7: [ '_movi'           , [ 'mov'      , 'bh'              ] , null  , BYTE                    ]
  , 0xb8: [ '_movi'           , [ 'mov'      , 'eax'             ] , null  , DWORD                   ]
  , 0xb9: [ '_movi'           , [ 'mov'      , 'ecx'             ] , null  , DWORD                   ]
  , 0xba: [ '_movi'           , [ 'mov'      , 'edx'             ] , null  , DWORD                   ]
  , 0xbb: [ '_movi'           , [ 'mov'      , 'ebx'             ] , null  , DWORD                   ]
  , 0xbc: [ '_movi'           , [ 'mov'      , 'esp'             ] , null  , DWORD                   ]
  , 0xbd: [ '_movi'           , [ 'mov'      , 'ebp'             ] , null  , DWORD                   ]
  , 0xbe: [ '_movi'           , [ 'mov'      , 'esi'             ] , null  , DWORD                   ]
  , 0xbf: [ '_movi'           , [ 'mov'      , 'edi'             ] , null  , DWORD                   ]
  , 0xeb: [ '_jmp'            , [ 'jmp'      , 'i/8'             ] , BYTE  , BYTE                    ]
  , 0xfe: [ '_inc_dec_b'      , [ 'inc/dec'  , 'r/8'             ] , null  , BYTE                    ]
}
