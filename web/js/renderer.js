'use strict';

var Handlebars = require('hbsfy/runtime')
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

proto._initRegs = function _initRegs(regs) {
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

  cpuEl.innerHTML = cpu_hbs({ regs: regInfos })
  regInfos.forEach(this._createRegEl, this);
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
}
