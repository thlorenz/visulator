'use strict';

var DWordRegName = {
    ax: 'eax', al: 'eax', ah: 'eax'
  , cx: 'ecx', cl: 'ecx', ch: 'ecx'
  , dx: 'edx', dl: 'edx', dh: 'edx'
  , bx: 'ebx', bl: 'ebx', bh: 'ebx'
  , sp: 'esp', bp: 'ebp'
  , si: 'esi', di: 'edi'
}

var getDWordRegName = exports.getDWordRegName = function getDWordRegName(name) {
  return name[0] === 'e' ? name : DWordRegName[name]
}

exports.getWordRegName = function getWordRegName(name) {
  // eax -> ax
  return getDWordRegName(name).slice(1);
}
