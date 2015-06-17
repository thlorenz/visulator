'use strict';

var Adder          = require('./adder')
var instruction    = require('../../lib/instruction')
var instructionHbs = require('../hbs/instruction.hbs')

function InstructionRenderer(el) {
  if (!(this instanceof InstructionRenderer)) return new InstructionRenderer(el);
  this._el = el
}

var proto = InstructionRenderer.prototype;
module.exports = InstructionRenderer;

proto._renderAdd = function _renderAdd(meta, el) {
  var adder = new Adder(el)
  adder.init(meta)

  function next() {
    adder.nextBit()
  }
  this._animationToken = setInterval(next, 800)
}

proto._renderInstruction = function _renderInstruction(instruction) {
  var html = instructionHbs(instruction)
  this._el.innerHTML = html
  return this._el.getElementsByClassName('visualization')[0]
}

proto.render = function render(meta) {
  this.stop()
  var visEl = this._renderInstruction(meta.op)
  switch (meta.op) {
    case instruction.add:
    case instruction.inc:
      return this._renderAdd(meta, visEl)
    default: return;
  }
}

proto.stop = function stop() {
  clearInterval(this._animationToken)
}
