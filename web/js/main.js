'use strict';

var docs_hbs = require('../hbs/documentation.hbs')
var samples    = require('../../test/fixtures/samples')
var Program    = require('../../lib/program')
var Renderer   = require('./renderer')
var asmEditor  = require('./asm-editor')()
var byteEditor = require('./byte-editor')()

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

function initDocs(renderer) {
  var docsEl = document.getElementById('docs')
  docsEl.innerHTML = docs_hbs({
      heading: 'Help'
    , text: 'Click on elements (like flags) to show details here.'
  })
  function renderDocs(docs) {
    docsEl.innerHTML = docs_hbs(docs)
  }
  renderer.ondocsRequested = renderDocs;
}

var program = initProgram()
var renderer = initRenderer(program)
initDocs(renderer)

function step(fwd) {
  var state;
  if (fwd) {
    state = program.step();
  } else {
    state = program.stepBack();
  }
  renderer.update(state)
  asmEditor.highlightInstruction(state.regs.eip);
}

function stepFwd() {
  step(true);
}

function stepBwd() {
  step(false);
}

function onstep(pos, fwd) {
  var currentStep = program.currentStep();
  if (currentStep === pos) return;

  if (typeof fwd === 'undefined') fwd = currentStep < pos;

  step(fwd);
  onstep(pos, fwd)
}

asmEditor.init(samples.addiw, ENTRY_POINT, onstep);
byteEditor.init(samples.addiw);
