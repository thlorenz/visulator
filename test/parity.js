'use strict';
var test = require('tape')
  , parity = require('../lib/parity')

test('\nensure we calculate odd parity correctly', function (t) {
  /* jslint esnext:true */
  var odd = 0, even = 1

  function check(tpl) {
    t.equal(parity(tpl[0]), tpl[1], 'odd parity of ' + tpl[0].toString(2) + ' == ' + tpl[1])
  }

  var nums = [
      [ 0b0   , even ]
    , [ 0b1   , odd ]
    , [ 0b10  , odd ]
    , [ 0b11  , even ]
    , [ 0b110 , even ]
    , [ 0b111 , odd ]
    , [ 0b101 , even ]
    , [ 0b110 , even ]
    , [ 0b111 , odd ]
  ]
  nums.forEach(check);
  t.end()
})
