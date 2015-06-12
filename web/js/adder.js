'use strict';

var Handlebars = require('hbsfy/runtime')
var srcTgtResHbs = require('../hbs/src-tgt-res.hbs')

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
 * @param {Object} data containing tgt and src bits
 * @param {Array.<Number>} data.tgt target bits, i.e. `[ 0, 1, 0, 0, ..]
 * @param {Array.<Number>} data.src source bits, i.e. `[ 0, 1, 0, 0, ..]
 */
proto.init = function init(data) {
  this._data = data;
  this._data.operation = '+';
  var html = srcTgtResHbs(data)
  this._el.innerHTML = html;
  this._srcBitEls = this._el.querySelectorAll('.src .col')
  this._tgtBitEls = this._el.querySelectorAll('.tgt .col')
  this._resBitEls = this._el.querySelectorAll('.res .binary-digit')
  this._carryEls = this._el.querySelectorAll('.carry .binary-digit')
  this._bitIdx = data.tgt.length - 1;
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
  var tgtEl = this._tgtBitEls.item(idx)
  if (srcEl) srcEl.classList.add('highlight')
  if (tgtEl) tgtEl.classList.add('highlight')
}

proto.nextBit = function nextBit() {
  if (this._bitIdx < 0) return;

  var idx = this._bitIdx--;
  var res = addBits(this._data.tgt[idx], this._data.src[idx], this._carry)

  var bit = res[0]
  this._carry = res[1]

  this._highlightBits(idx)
  this._renderRes(idx, bit)
  this._renderCarry(idx)
}
