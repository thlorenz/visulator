'use strict';

var binary = require('../../lib/binary')
var Handlebars = require('hbsfy/runtime')
var srcDstResHbs = require('../hbs/src-dst-res.hbs')

Handlebars.registerPartial('_binary-digit', require('../hbs/_binary-digit.hbs'))

function addBits(b1, b2, carry) {
  var sum = b1 + b2 + carry
  return  sum === 0 ? [ 0, 0 ]
        : sum === 1 ? [ 1, 0 ]
        : sum === 2 ? [ 0, 1 ]
        :             [ 1, 1 ]
}

function Adder(el) {
  if (!(this instanceof Adder)) return new Adder(el);

  this._el = el;
}

var proto = Adder.prototype;
module.exports = Adder;

/**
 * Inits adder which draws initial state to element.
 *
 * @name init
 * @function
 * @param {Object} data containing dst and src bits
 * @param {Array.<Number>} data.dst target bits, i.e. `[ 0, 1, 0, 0, ..]
 * @param {Array.<Number>} data.src source bits, i.e. `[ 0, 1, 0, 0, ..]
 */
proto.init = function init(data) {
  this._data = data;
  this._data.dst = binary.array(data.dst, data.bytes)
  this._data.src = binary.array(data.src, data.bytes)
  this._data.operation = data.op.symbol;

  var html = srcDstResHbs(this._data)
  this._el.innerHTML = html;
  this._srcBitEls = this._el.querySelectorAll('.src .col')
  this._dstBitEls = this._el.querySelectorAll('.dst .col')
  this._resBitEls = this._el.querySelectorAll('.res .binary-digit')
  this._carryEls = this._el.querySelectorAll('.carry .binary-digit')
  this._bitIdx = this._data.dst.length - 1;
  this._carry = 0
}

proto._renderCarry = function _renderCarry(idx) {
  var el = this._carryEls.item(idx);
  if (el) el.classList.add(this._carry ? 'b1' : 'b0');
}

proto._renderRes = function _renderRes(idx, bit) {
  var el = this._resBitEls.item(idx)
  if (el) el.classList.add(bit ? 'b1' : 'b0')
}

proto._highlightBits = function _hightlightBits(idx) {
  var srcEl = this._srcBitEls.item(idx)
  var dstEl = this._dstBitEls.item(idx)
  if (srcEl) srcEl.classList.add('highlight')
  if (dstEl) dstEl.classList.add('highlight')
}

proto.nextBit = function nextBit() {
  if (this._bitIdx < 0) return;

  var idx = this._bitIdx--;
  var res = addBits(this._data.dst[idx], this._data.src[idx], this._carry)

  var bit = res[0]
  this._carry = res[1]

  this._highlightBits(idx)
  this._renderRes(idx, bit)
  this._renderCarry(idx)
}
