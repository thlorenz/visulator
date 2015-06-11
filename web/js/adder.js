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
  var html = srcTgtResHbs(data)
  this._el.innerHTML = html;
  this._resBitEls = this._el.getElementsByClassName('binary-digit')
  this._bitIdx = data.tgt.length - 1;
  this._carry = 0
}

proto.nextBit = function nextBit() {
  if (this._bitIdx < 0) return;

  var idx = this._bitIdx--;
  var res = addBits(this._data.tgt[idx], this._data.src[idx], this._carry)

  var bit = res[0]
  this._carry = res[1]

  console.log({ bit: bit, carry: this._carry })
  this._resBitEls.item(idx).classList.add(bit ? 'b1' : 'b0')
}
