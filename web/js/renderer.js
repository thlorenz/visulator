'use strict';

var Handlebars = require('hbsfy/runtime')
  , cpu_hbs = require('../hbs/cpu.hbs')
  , cpuEl = document.getElementById('cpu')

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
}

proto._updateRegs = function _updateRegs(regs) {
  // TODO use odometer to update one by one with animation
  this._initRegs(regs)
}
