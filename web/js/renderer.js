'use strict';

var Handlebars = require('hbsfy/runtime')
  , xtend = require('xtend')
  , cpu_hbs = require('../hbs/cpu.hbs')
  , cpuEl = document.getElementById('cpu')

var zeroPad = '00000000'

// zero padded binary number (8 bits each)
function binary(num) {
  var s = num.toString(2)
  return zeroPad.slice(0, 8 - s.length) + s
}

// zero padded hexadecimal number (2 bytes each)
function hex(num) {
  var s = num.toString(16)
  return zeroPad.slice(0, 2 - s.length) + s
}

Handlebars.registerPartial('_registers', require('../hbs/_registers.hbs'))

function Renderer(initialState) {
  if (!(this instanceof Renderer)) return new Renderer(initialState);

  this._initRegs(initialState.regs)
}

var proto = Renderer.prototype;
module.exports = Renderer;

proto.update = function update(state) {
  this._updateRegs(state.regs);
}

proto._createRegEl = function _createRegEl(reg) {
  var name = reg.name;
  this['_' + name + '_binary'] = [
      document.getElementById('reg-' + name + '-0-binary')
    , document.getElementById('reg-' + name + '-1-binary')
    , document.getElementById('reg-' + name + '-2-binary')
    , document.getElementById('reg-' + name + '-3-binary')
  ]
  this['_' + name + '_hex'] = [
      document.getElementById('reg-' + name + '-0-hex')
    , document.getElementById('reg-' + name + '-1-hex')
    , document.getElementById('reg-' + name + '-2-hex')
    , document.getElementById('reg-' + name + '-3-hex')
  ]
}

proto._createFlagEl = function _createFlagEl(flag) {
  this._flagEls[flag.id] = document.getElementById(flag.id)
}

proto._initRegs = function _initRegs(regs) {
  var self = this;
  var regInfos = [
      { name: 'eax', value: [ 0, 0, 0, 0 ] }
    , { name: 'ebx', value: [ 0, 0, 0, 0 ] }
    , { name: 'ecx', value: [ 0, 0, 0, 0 ] }
    , { name: 'edx', value: [ 0, 0, 0, 0 ] }
    , { name: 'esi', value: [ 0, 0, 0, 0 ] }
    , { name: 'edi', value: [ 0, 0, 0, 0 ] }
    , { name: 'ebp', value: [ 0, 0, 0, 0 ] }
    , { name: 'esp', value: [ 0, 0, 0, 0 ] }
    , { name: 'eip', value: [ 0, 0, 0, 0 ] }
  ]

  function toFlagInfo(acc, k) {
    var flag = self._flagsMeta[k]
    acc.push({
        display     : k
      , id          : k.toLowerCase()
      , name        : flag.name
      , description : flag.description
    })
    return acc
  }
  var flagInfos = Object.keys(this._flagsMeta).reduce(toFlagInfo, []);

  cpuEl.innerHTML = cpu_hbs({ regs: regInfos, eflags: flagInfos })

  regInfos.forEach(this._createRegEl, this);

  this._flagEls = {}
  flagInfos.forEach(this._createFlagEl, this)
  this._updateRegs(regs);
}

proto._updateOdometerElements = function _updateOdometerElements(odometerEl, s) {
  var els = odometerEl.getElementsByTagName('span'), el, className;
  var chars = s.split('')
  for (var i = 0; i < els.length; i++) {
    el = els.item(i)
    el.setAttribute('class', 'd' + chars[i])
  }
}

proto._updateReg = function _updateReg(tgt, src, formatFn) {
  // src is stored in little endian format
  // we visualize it reversed since that reads easier
  this._updateOdometerElements(tgt[0], formatFn(src[3]))
  this._updateOdometerElements(tgt[1], formatFn(src[2]))
  this._updateOdometerElements(tgt[2], formatFn(src[1]))
  this._updateOdometerElements(tgt[3], formatFn(src[0]))
}

proto._updateRegs = function _updateRegs(regs) {
  this._updateReg(this._eax_binary, regs.eax_bytes, binary)
  this._updateReg(this._ebx_binary, regs.ebx_bytes, binary)
  this._updateReg(this._ecx_binary, regs.ecx_bytes, binary)
  this._updateReg(this._edx_binary, regs.edx_bytes, binary)
  this._updateReg(this._esi_binary, regs.esi_bytes, binary)
  this._updateReg(this._edi_binary, regs.edi_bytes, binary)
  this._updateReg(this._ebp_binary, regs.ebp_bytes, binary)
  this._updateReg(this._esp_binary, regs.esp_bytes, binary)
  this._updateReg(this._eip_binary, regs.eip_bytes, binary)

  this._updateReg(this._eax_hex, regs.eax_bytes, hex)
  this._updateReg(this._ebx_hex, regs.ebx_bytes, hex)
  this._updateReg(this._ecx_hex, regs.ecx_bytes, hex)
  this._updateReg(this._edx_hex, regs.edx_bytes, hex)
  this._updateReg(this._esi_hex, regs.esi_bytes, hex)
  this._updateReg(this._edi_hex, regs.edi_bytes, hex)
  this._updateReg(this._ebp_hex, regs.ebp_bytes, hex)
  this._updateReg(this._esp_hex, regs.esp_bytes, hex)
  this._updateReg(this._eip_hex, regs.eip_bytes, hex)

  this._updateEFlags(regs.eflags_hash)
}

proto._updateFlag = function _updateFlag(k) {
  var id = k.toLowerCase()
    , el = this._flagEls[id]

  if (!!this.__eflags_hash[k]) {
    el.children[1].classList.add('lit');
  } else {
    el.children[1].classList.remove('lit');
  }
}

proto._updateEFlags = function _updateEFlags(eflags_hash) {
  this.__eflags_hash = eflags_hash
  Object.keys(this._flagsMeta).forEach(this._updateFlag, this);
}

proto._flagsMeta = {
    CF: { name: 'Carry Flag',
          description: 'set if the result of an add or shift operation carries out a bit beyond the destination operand; otherwise cleared' }
  , PF: { name: 'Parity Flag',
          description: 'set if the number of 1-bits in the low byte of the result is even, otherwise cleared' }
  , AF: { name: 'Adjust Flag',
          description: 'auxiliary carry used for 4-bit BCD math, set when an operation causes a carry out of a 4-bit BCD quantity' }
  , ZF: { name: 'Zero Flag',
          description: 'set if the result of an operation is zero, otherwise cleared' }
  , TF: { name: 'Trap Flag',
          description: 'for debuggers, permits operation of a processor in single-step mode' }
  , SF: { name: 'Sign Flag',
          description: 'set when the sign of the result forces the destination operand to become negative, i.e. its most significant bit is set' }
  , IF: { name: 'Interrupt Enable Flag',
          description: 'determines whether or not the CPU will handle maskable hardware interrupts' }
  , DF: { name: 'Direction Flag',
          description: 'controls the left-to-right or right-to-left direction of string processing' }
  , OF: { name: 'Overflow Flag',
          description: 'set if the result is too large to fit in the destination operand' }
}

