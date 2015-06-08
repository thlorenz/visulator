'use strict';

var samples         = require('../../test/fixtures/samples')
var Program         = require('../../lib/program')
var Renderer        = require('./renderer')
var asmEditor       = require('./asm-editor')()
var byteEditor     = require('./byte-editor')()

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

asmEditor.init(samples.addiw, ENTRY_POINT);
byteEditor.init(samples.addiw);
