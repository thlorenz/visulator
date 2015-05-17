'use strict';
var debug = require('debug')('mem');
var hex = require('../hexstring')
var assert = require('assert')

/*
 * Memory structur looks similar to this:
 *
 *   +---------------------+  |  ~0xffffff (upper address)
 *   |  The Stack          |  |
 *   |                     |  |
 *   |---------------------|  \/  stack grows this way
 *   |                     |
 *   |  Unallocated        |
 *   |  virtual            |
 *   |  memory             |
 *   |                     |
 *   |---------------------|  /\  allocated memory grows this way
 *   |                     |  |
 *   |  .bss section       |  |   named uninitialized bytes (buffers)
 *   |                     |  |
 *   |---------------------|  |
 *   |                     |
 *   |  .data section      |      definitions of initialized data items
 *   |                     |
 *   |---------------------|
 *   |                     |
 *   |  .text section      |      machine instructions (our program)
 *   |                     |
 *   +---------------------+    ~0x00000 (lower address)
 *
 *   For simplicity our memory starts at 0x0, even though in real life
 *   program code and data  will be down somewhere near (but not below) 08048000h.
 *   Your stack will be up somewhere near (but not above) 0BFFFFFFFh.
 */
function Memory() {
  if (!(this instanceof Memory)) return new Memory();
}
module.exports = Memory;

var proto = Memory.prototype;

proto.init = function init(memSize, entryPoint, text, data, bss, stack) {
  var i;
  memSize        = memSize || 0xffff;
  this._mem      = new Array(memSize);
  this._memStart = 0x0;
  this._memEnd   = this._memStart + memSize;

  // copy each section into the proper memory slots
  this._textStart = entryPoint;
  debug('init - %o', {
      memSize: hex(memSize)
    , entryPoint: hex(this._textStart)
  })

  // XXX: not sure if data really always starts right after text
  this._dataStart = this._textStart + text.length;

  this._bssStart =  this._dataStart + data.length;

  assert(this._textStart < this._memEnd, 'text starts outside memory');
  assert(this._textStart + text.length < this._memEnd, 'text ends outside memory');
  assert(this._dataStart < this._memEnd, 'data starts outside memory');
  assert(this._dataStart + data.length < this._memEnd, 'data ends outside memory');
  assert(this._bssStart < this._memEnd, 'bss starts outside memory');
  assert(this._bssStart + bss.length < this._memEnd, 'bss ends outside memory');

  for (i = 0; i < text.length; i++)
    this._mem[this._textStart + i] = text[i];

  for (i = 0; i < data.length; i++)
    this._mem[this._dataStart + i] = data[i];

  for (i = 0; i < bss.length; i++)
    this._mem[this._bssStart + i] = bss[i];

  // we assume that the stack is given to us LIFO order
  var sp = this._memEnd;
  for (i = stack.length - 1; i >= 0; i--, sp--)
    this._mem[sp] = stack[i];

  debug('init - text: [ %s ]', text.map(hex));
  debug('init - data: [ %s ]', data.map(hex));
  debug('init - bss: [ %s ]', bss.map(hex));
  debug('init - stack: [ %s ]', stack.map(hex));

  // sp is managed in regs like all other registers
  return sp;
}

proto.store = function store(addr, bytes) {
  debug('storing %s at addr: %s', hex(bytes), hex(addr));
  if (!Array.isArray(bytes)) return (this._mem[addr] = bytes);
  for (var i = 0; i < bytes.length; i++) this._mem[addr + i] = bytes[i];
}

proto.load = function load(addr, size /* in bytes */) {
  debug('loading %s bytes from addr: %s [ %s, ..]',
        hex(size), hex(addr), hex(this._mem[addr]));
  return this._mem.slice(addr, addr + size);
}

proto.stack = function stack(esp) {
  return this._mem.slice(esp);
}
