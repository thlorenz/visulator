'use strict';
var BYTES_ROW_WIDTH = 10
var table = require('text-table')
var disasm = require('../../lib/disasm')
var hexstring = require('../../lib/hexstring')
var samples = require('../../test/fixtures/samples')
var Program = require('../../lib/program')
var Renderer = require('./renderer')

var ENTRY_POINT = 0x100

var initialState = {
    entryPoint: ENTRY_POINT
  , regs: {
      eax: 0x0
    , ecx: 0x0
    , edx: 0x0
    , ebx: 0x0
    , esp: 0x0
    , ebp: 0x0
    , esi: 0x0
    , edi: 0x0
    , eip: ENTRY_POINT
    , eflags: 0x202
  }
}

var inBrowser = typeof window !== 'undefined';
var asmEditor, byteEditor;

function inspect(obj, depth) {
  console.log(require('util').inspect(obj, false, depth || 5, false));
}

function toRow(i) {
  return [ '0x' + i.addressString,  '\'' + i.opcodesString + '\'',  i.mnemonic, i.op_str ]
}

function opsAndAsmText(insts) {
  var rows = insts.map(toRow);
  return table(rows, { align: [ 'r', 'l', 'l', 'l' ] });
}

function bytesText(bytes) {
  // split into evenly sized rows
  var hexes = bytes.map(hexstring);
  var s = '';

  var partsFloat = hexes.length / BYTES_ROW_WIDTH;
  var parts = ~~partsFloat;
  if (parts < partsFloat) parts++;

  console.log('parts: %d, partsFloat: %d', parts, partsFloat);
  var i;
  for (i = 0; i < parts; i++) {
    s += hexes.slice(i * BYTES_ROW_WIDTH, i * BYTES_ROW_WIDTH + BYTES_ROW_WIDTH).join(' ') + '\n';
  }

  s += hexes.slice(++i * BYTES_ROW_WIDTH).join(' ');
  return s;
}


function initEditors(instr) {
  var ace = require('brace');
  require('brace/mode/assembly_x86');
  require('brace/mode/plain_text');
  require('brace/theme/monokai');
  require('brace/theme/github');

  byteEditor = ace.edit('byte-editor');
  byteEditor.getSession().setMode('ace/mode/plain_text');
  byteEditor.setTheme('ace/theme/github');
  byteEditor.setFontSize(16);
  byteEditor.renderer.setShowGutter(false);
  // todo: refresh on edit of course ;)
  byteEditor.setReadOnly(true);
  byteEditor.$blockScrolling = Infinity

  asmEditor = ace.edit('asm-editor');
  asmEditor.getSession().setMode('ace/mode/assembly_x86');
  asmEditor.setTheme('ace/theme/monokai');
  asmEditor.setFontSize(14);
  asmEditor.renderer.setShowGutter(false);
  asmEditor.setReadOnly(true);
  asmEditor.$blockScrolling = Infinity
}

if (inBrowser) initEditors();

var instr = disasm(samples.addiw, ENTRY_POINT);
var bytes = bytesText(samples.addiw);
var asm = opsAndAsmText(instr);

function initProgram() {
  return new Program({
      memSize    : initialState.regs.esp
    , entryPoint : initialState.entryPoint
    , text       : samples.addiw
    , regs       : initialState.regs
  });
}

function initRenderer(program) {
  return new Renderer(program._currentCPUState());
}

var program = initProgram()
var renderer = initRenderer(program)

function step(fwd) {
  var state;
  if (fwd) {
    state = program.step();
  } else {
    state = program.stepBack();
  }
  console.dir(state);
  console.log(state.regs.eax)

  renderer.update(state)
}

function stepFwd() {
  step(true);
}

function stepBwd() {
  step(false);
}

function initStepping() {
  var fwd = document.getElementById('step-fwd')
    , bwd = document.getElementById('step-bwd')

  fwd.onclick = stepFwd;
  bwd.onclick = stepBwd;
}
initStepping();

if (inBrowser) {
  byteEditor.setValue(bytes);
  byteEditor.clearSelection();
  asmEditor.setValue(asm);
  asmEditor.clearSelection();
} else {
  console.log(bytes);
  console.log(asm);
}

