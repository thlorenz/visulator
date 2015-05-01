'use strict';

var colors = require('ansicolors')
var steps = require('./inc.js').steps
var table = require('text-table')

var tableized = steps.map(tableize);
console.log(table(tableized));

function tableize(step) {
  function toString(acc, k, idx) {
    if (k === 'eip') return acc;
    var d = step.diff[k];
    var s = acc;
    if (idx) s += ',';
    s += ' ' + k + ': ' + d.prev.hex + ' -> ' + d.curr.hex;

    if (k === 'eflags') s += ' ' + d.curr.flagsString;
    return s;
  }
  var diffString = step.diff
    ? Object.keys(step.diff).reduce(toString, '')
    : ''

  var m = step.instruction.match(/^([a-f0-9]{2} )+/);
  var opcodes = m[0].trim()
    , inst = step.instruction.replace(opcodes, '').trim();

  return [ colors.brightBlue(opcodes), colors.green(inst), colors.brightBlack(';' + diffString) ];
}
