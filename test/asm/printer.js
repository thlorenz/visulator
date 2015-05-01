'use strict';

var colors = require('ansicolors')
var steps = require('./inc.js').steps
var table = require('text-table')

var tableized = steps.map(tableize);
console.log(table(tableized));

function tableize(step) {
  function toString(acc, k) {
    if (k === 'eip') return acc;
    var d = step.diff[k];
    return acc + ' ' + k + ': ' + d.prev.hex + ' -> ' + d.curr.hex; 
  }
  var diffString = step.diff 
    ? Object.keys(step.diff).reduce(toString, '')
    : ''

  var m = step.instruction.match(/^([a-f0-9]{2} )+/);
  var opcodes = m[0].trim()
    , inst = step.instruction.replace(opcodes, '').trim();

  return [ colors.green(opcodes), colors.brightBlue(inst), colors.brightBlack(';' + diffString) ];
}
