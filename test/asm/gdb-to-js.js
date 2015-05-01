#!/usr/bin/env node

'use strict';

var fs = require('fs')
  , path = require('path')

var data = [];
process.stdin
  .on('data', ondata)
  .on('end', onend)
  .on('error', console.error)

function ondata(d) {
  data.push(d);
}

function inspect(obj, depth) {
  console.error(require('util').inspect(obj, false, depth || 5, true));
}

function insp(obj, depth) {
  return require('util').inspect(obj, false, depth || 5, false);
}

function onend() {
  var lines = Buffer.concat(data, data.length).toString().split('\n')
  processLines(lines);
}

function diffRegs(prev, regs) {
  if (!prev) return {};

  function collectDiff(acc, k) {
    var p = prev[k], c = regs[k];
    if (!p || p.hex === c.hex) return acc;

    acc[k] = { prev: p, curr:  c };
    return acc;
  }

  return Object.keys(regs).reduce(collectDiff, {});
}

function collectOpCodes(results) {
  function opcode(x) {
    var inst = x.instruction
    var m = inst.match(/^([a-f0-9]{2} )+/);
    if (!m) throw new Error('Couldn\'t find opcode for ' + inst);
    return m[0]
  }
  return results.map(opcode)
}

function processLines(lines) {
  var line, res = {}, results = [], prevRegs

  inspect(lines)
  // find test start
  for (line = lines.shift(); typeof line !== 'undefined'; line = lines.shift()) {
    var match = /^=>.+?_start\.visulator_test_start\+0/.test(line)
    if (match) break;
  }

  if (!line) throw new Error('Cannot find test start');

  var last;
  while (line) {
    // testEnd signals that we saw the test_end label as the next instruction
    // That means we need to still execute one more instruction to see reg
    // changes
    if (last) break;
    if (res.testEnd) last = true;

    res = processFrame(line, lines)
    line = res.nextLine

    // registers we see now actually were changed due
    // to executing previous instruction, so we correct that
    if (results[results.length - 1]) {
      results[results.length - 1].regs = res.regs;
      results[results.length -1 ].diff = diffRegs(prevRegs, res.regs);
    }

    prevRegs = res.regs;
    delete res.nextLine;
    results.push(res);
  }

  var opcodes = collectOpCodes(results);

  var js =  'exports.results = ' + insp(results) + '\n'
          + 'exports.opcodes = ' + insp(opcodes);

  fs.writeFileSync(path.join(__dirname, 'inc.js'), js)
}

function processFrame(line, lines) {
  var lineArg = line;
  var parts = line.split('>:')
  var inst = parts[1].trim()
  var regs = {}, regName, hexVal, decVal, flags, flagsString, testEnd;

  // line points to **next** instruction while regs point to current
  for (line = lines.shift(); typeof line !== 'undefined'; line = lines.shift()) {
    var end = /^=>.+?_start\.visulator_test_end\+\d+/.test(line)
    //if (end) testEnd = true;

    var nextFrame = /^=>.+?_start\.visulator_test_start\+\d+/.test(line)
    if (nextFrame) break;

    parts = line.split(/ +/);
    if (parts.length < 3) continue;

    regName = parts[0]
    // little hacky, but works
    if (regName === '=>') continue;

    hexVal = parts[1]

    // eflags
    if (/^eflags/.test(line)) {
      flagsString = parts.slice(2).join(' ');
      regs[regName] = { hex: hexVal, flagsString: flagsString, flags: processFlags(flagsString) }
      continue;
    }

    // all registers except eflag
    decVal = regName === 'esp'
          || regName === 'ebp'
          || regName === 'eip' ? undefined : parts[2]

    regs[regName] = { hex: hexVal, decimal: decVal }
  }

  return {
      line        : lineArg
    , instruction : inst
    , diff        : undefined
    , regs        : regs
    , nextLine    : line
    , testEnd     : testEnd
  }
}

function processFlags(flagsString) {
  function setFlag(acc, k) { acc[k.trim()] = true; return acc; }
  return flagsString
    .replace(/\[ /, '')
    .replace(/ \]/, '')
    .split(' ')
    .reduce(setFlag, {});
}
