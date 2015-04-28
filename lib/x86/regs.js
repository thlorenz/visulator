'use strict';

function Registers() {
  if (!(this instanceof Registers)) return new Registers();
  this.eax = 0x0   // accumulator
  this.ebx = 0x0   // base register
  this.ecx = 0x0   // count register
  this.edx = 0x0   // data register
  this.esi = 0x0   // source index
  this.edi = 0x0   // destination index
  this.ebp = 0x0   // base pointer
  this.esp = 0x0   // stack pointer
  this.eip = 0x0   // instruction pointer 

  this.eflags = 0x0 // flags -- TODO: what's the real initial state?
}

var proto = Registers.prototype;

module.exports = Registers;
