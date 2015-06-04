'use strict';

var ControlUnit = require('./x86/cu')

function Program(opts) {
  if (!(this instanceof Program)) return new Program(opts);

  this._opts = opts;
  this._cu = new ControlUnit();
  this._states = [];
  this._instructionIndex = 0;
  this._initCu(this._opcodes);
}

var proto = Program.prototype;
module.exports = Program;

proto._initCu = function _initCu(code) {
  this._cu.init(this._opts);
  this._states[this._instructionIndex] = this._currentCPUState();
}

proto._getRegs = function _getRegs() {
  var r = this._cu.regs;
  return {
    ah: r.ah, al: r.al, ax: r.ax, eax: r.eax, eax_bytes: r._eax,
    ch: r.ch, cl: r.cl, cx: r.cx, ecx: r.ecx, ecx_bytes: r._ecx,
    dh: r.dh, dl: r.dl, dx: r.dx, edx: r.edx, edx_bytes: r._edx,
    bh: r.bh, bl: r.bl, bx: r.bx, ebx: r.ebx, ebx_bytes: r._ebx,
                        si: r.si, esi: r.esi, esi_bytes: r._esi,
                        di: r.di, edi: r.edi, edi_bytes: r._edi,
                        bp: r.bp, ebp: r.ebp, ebp_bytes: r._ebp,
                        sp: r.sp, esp: r.esp, esp_bytes: r._esp,
                                  eip: r.eip, eip_bytes: r._eip
  }
}

proto._currentCPUState = function _currentCPUState() {
  return {
      mem: this._cu.mem
    , regs: this._getRegs()
  }
}

proto.step = function step() {
  // did we already run this instruction
  // and then stepped back?
  var steppedAlready = 
       this._instructionIndex > 0 
    && this._instructionIndex < this._states.length
  if (steppedAlready) return this._states[this._instructionIndex++]

  this._cu.next();
  this._instructionIndex++;
  var state = this._currentCPUState();
  this._states[this._instructionIndex] = state;
  return state;
}

proto.stepBack = function stepBack() {
  if (this._instructionIndex === 0) return this._states[0]
  this._instructionIndex--
  return this._states[this._instructionIndex]
}
