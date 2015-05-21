'use strict';
var test = require('tape')
  , parity = require('../lib/parity')

test('\nensure we calculate odd parity correctly', function (t) {
  /* jslint esnext:true */
  var odd = 0, even = 1

  function check(tpl) {
    t.equal(parity(parseInt(tpl[0], 2)), tpl[1], 'odd parity of ' + tpl[0].toString(2) + ' == ' + tpl[1])
  }

  var nums = [
      [ '00'   , even ]
    , [ '01'   , odd ]
    , [ '010'  , odd ]
    , [ '011'  , even ]
    , [ '0110' , even ]
    , [ '0111' , odd ]
    , [ '0101' , even ]
    , [ '0110' , even ]
    , [ '0111' , odd ]
  ]
  nums.forEach(check);
  t.end()
})
