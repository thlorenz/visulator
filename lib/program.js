'use strict';

var ControlUnit = require('./x86/cu')
var xtend = require('xtend')

function Program(opts) {
  if (!(this instanceof Program)) return new Program(opts);

  this._opts = opts;
  this._cu = new ControlUnit();
  this._states = [];
  this._step = 0;
  this._initCu();
}

var proto = Program.prototype;
module.exports = Program;

proto._initCu = function _initCu() {
  this._cu.init(this._opts);
  this._states[this._step] = this._currentCPUState();
}

proto._getRegs = function _getRegs() {
  var r = this._cu.regs;
  function toFlagHash(acc, k) {
    acc[k] = r.isFlagSet(k)
    return acc
  }

  var flagsHash = Object.keys(this._cu.regs._flagIndexes).reduce(toFlagHash, {})

  // extending bytes to get a clone of the bytes array
  return {
    eax: r.eax, eax_bytes: xtend(r._eax), ax: r.ax, ah: r.ah, al: r.al,
    ecx: r.ecx, ecx_bytes: xtend(r._ecx), cx: r.cx, ch: r.ch, cl: r.cl,
    edx: r.edx, edx_bytes: xtend(r._edx), dx: r.dx, dh: r.dh, dl: r.dl,
    ebx: r.ebx, ebx_bytes: xtend(r._ebx), bx: r.bx, bh: r.bh, bl: r.bl,
    esi: r.esi, esi_bytes: xtend(r._esi), si: r.si,
    edi: r.edi, edi_bytes: xtend(r._edi), di: r.di,
    ebp: r.ebp, ebp_bytes: xtend(r._ebp), bp: r.bp,
    esp: r.esp, esp_bytes: xtend(r._esp), sp: r.sp,
    eip: r.eip, eip_bytes: xtend(r._eip),
    eflags: r.eflags, eflags_hash: flagsHash
  }
}

proto._currentCPUState = function _currentCPUState() {
  return {
      mem             : this._cu.mem
    , regs            : this._getRegs()
    , instructionMeta : this._cu.instructionMeta
  }
}

proto.step = function step() {
  this._step++;

  var haveState = this._step < this._states.length
  if (haveState) return this._states[this._step]

  this._cu.next();
  var state = this._currentCPUState();
  this._states[this._step] = state;
  return state;
}

proto.stepBack = function stepBack() {
  if (this._step === 0) return this._states[0]
  this._step--;
  return this._states[this._step]
}

proto.peek = function peek() {
  var state = this.step();
  this.stepBack();
  return state;
}

proto.currentStep = function currentStep() {
  return this._step;
}
