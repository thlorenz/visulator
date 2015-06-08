'use strict';

var BYTES_ROW_WIDTH = 12

var ace = require('brace');
require('brace/mode/plain_text');
require('brace/theme/github');

var hexstring = require('../../lib/hexstring')

function bytesText(bytes) {
  // split into evenly sized rows
  var hexes = bytes.map(hexstring);
  var s = '';

  var partsFloat = hexes.length / BYTES_ROW_WIDTH;
  var parts = ~~partsFloat;
  if (parts < partsFloat) parts++;

  var i;
  for (i = 0; i < parts; i++) {
    s += hexes.slice(i * BYTES_ROW_WIDTH, i * BYTES_ROW_WIDTH + BYTES_ROW_WIDTH).join(' ') + '\n';
  }

  s += hexes.slice(++i * BYTES_ROW_WIDTH).join(' ');
  return s;
}

function ByteEditor() {
  if (!(this instanceof ByteEditor)) return new ByteEditor();

  this._editor = ace.edit('byte-editor');
  this._editor.getSession().setMode('ace/mode/plain_text');
  this._editor.setTheme('ace/theme/github');
  this._editor.setFontSize(14);
  this._editor.renderer.setShowGutter(false);
  this._editor.setReadOnly(true);
  this._editor.$blockScrolling = Infinity
}

var proto = ByteEditor.prototype;
module.exports = ByteEditor;

proto.init = function init(opcodes) {
  this._editor.setValue(bytesText(opcodes));
  this._editor.clearSelection();
}
