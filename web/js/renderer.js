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
Handlebars.registerHelper("hexadecimal", function(num) {
  var s = num.toString(16)
  return zeroPad.slice(0, 2 - s.length) + s
})

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

proto._initRegs = function _initRegs(regs) {
  cpuEl.innerHTML = cpu_hbs({
    regs: [
      { name: 'eax', value: regs.eax_bytes }
    , { name: 'ebx', value: regs.ebx_bytes }
    , { name: 'ecx', value: regs.ecx_bytes }
    , { name: 'edx', value: regs.edx_bytes }
    ]
  })

  this._eax_bytes = [
      document.getElementById('reg-eax-0')
    , document.getElementById('reg-eax-1')
    , document.getElementById('reg-eax-2')
    , document.getElementById('reg-eax-3')
  ]
  this._ebx_bytes = [
      document.getElementById('reg-ebx-0')
    , document.getElementById('reg-ebx-1')
    , document.getElementById('reg-ebx-2')
    , document.getElementById('reg-ebx-3')
  ]
  this._ecx_bytes = [
      document.getElementById('reg-ecx-0')
    , document.getElementById('reg-ecx-1')
    , document.getElementById('reg-ecx-2')
    , document.getElementById('reg-ecx-3')
  ]
  this._edx_bytes = [
      document.getElementById('reg-edx-0')
    , document.getElementById('reg-edx-1')
    , document.getElementById('reg-edx-2')
    , document.getElementById('reg-edx-3')
  ]
}

proto._updateOdometerElements = function _updateOdometerElements(odometerEl, s) {
  var els = odometerEl.getElementsByTagName('span'), el, className;
  var chars = s.split('')
  for (var i = 0; i < els.length; i++) {
    el = els.item(i)
    el.setAttribute('class', 'd' + chars[i])
  }
}

proto._updateReg = function _updateReg(tgt, src) {
  // src is stored in little endian format
  // we visualize it reversed since that reads easier
  this._updateOdometerElements(tgt[0], binary(src[3]))
  this._updateOdometerElements(tgt[1], binary(src[2]))
  this._updateOdometerElements(tgt[2], binary(src[1]))
  this._updateOdometerElements(tgt[3], binary(src[0]))
}

proto._updateRegs = function _updateRegs(regs) {
  this._updateReg(this._eax_bytes, regs.eax_bytes)
  this._updateReg(this._ebx_bytes, regs.ebx_bytes)
  this._updateReg(this._ecx_bytes, regs.ecx_bytes)
  this._updateReg(this._edx_bytes, regs.edx_bytes)
}
