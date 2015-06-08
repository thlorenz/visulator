'use strict';

var table  = require('text-table')
var disasm = require('../../lib/disasm')

var ace = require('brace');
require('brace/mode/assembly_x86');
require('brace/theme/monokai');

function toRow(inst) {
  return [ '0x' + inst.addressString,  '\'' + inst.opcodesString + '\'',  inst.mnemonic, inst.op_str ]
}

function opsAndAsmText(insts) {
  var rows = insts.map(toRow);
  return table(rows, { align: [ 'r', 'l', 'l', 'l' ] });
}

function AsmEditor() {
  if (!(this instanceof AsmEditor)) return new AsmEditor();

  this._editor = ace.edit('asm-editor');
  this._session = this._editor.getSession();
  this._session.setMode('ace/mode/assembly_x86');
  this._editor.setTheme('ace/theme/monokai');
  this._editor.setFontSize(12);
  this._editor.renderer.setShowGutter(false);
  this._editor.setReadOnly(true);
  this._editor.setHighlightActiveLine(true);
  this._editor.$blockScrolling = Infinity
}

var proto = AsmEditor.prototype;
module.exports = AsmEditor;

proto.init = function init(opcodes, entryPoint) {
  var instr = disasm(opcodes, entryPoint);
  this._asm = opsAndAsmText(instr);
  this._asmLines = this._asm.split('\n');
  this._editor.setValue(this._asm);
  this._editor.clearSelection();
  this._editor.gotoLine(1)
}

proto.highlightInstruction = function highlightInstruction(address) {
  var line, match, addr;
  for (var i = 0, len = this._asmLines.length; i < len; i++) {
    line = this._asmLines[i]
    addr = parseInt(line.split(' ')[0], 16)
    if (addr === address) this._editor.gotoLine(i + 1);
  }
}
