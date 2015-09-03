'use strict';

module.exports = {
    add: {
        name: 'add'
      , symbol: '+'
      , description: 'Adds the source to the destination and stores result in the destination.'
      , url: 'https://courses.engr.illinois.edu/ece390/books/artofasm/CH06/CH06-2.html#HEADING2-48'
    }
  , sub: {
        name: 'sub'
      , symbol: '-'
      , description: 'Substracts the source from the destination and stores result in the destination.'
      , url: 'https://courses.engr.illinois.edu/ece390/books/artofasm/CH06/CH06-2.html#HEADING2-171'
    }
  , and: {
        name: 'and'
      , symbol: '&'
      , description: 'Performs logical AND operation and stores result in destination.'
      , url: 'http://www.aldeid.com/wiki/X86-assembly/Instructions/and'
    }
  , or: {
        name: 'or'
      , symbol: '|'
      , description: 'Performs logical OR operation and stores result in destination.'
      , url: 'http://www.aldeid.com/wiki/X86-assembly/Instructions/or'
    }
  , xor: {
        name: 'xor'
      , symbol: '^'
      , description: 'Performs logical exclusive OR operation and stores result in destination.'
      , url: 'http://www.aldeid.com/wiki/X86-assembly/Instructions/xor'
    }
  , cmp: {
        name: 'cmp'
      , symbol: ''
      , description: 'The cmp instruction is used to perform comparison. It\'s identical to the sub instruction except it does not affect operands.'
      , url: 'http://www.aldeid.com/wiki/X86-assembly/Instructions/cmp'
    }
  , inc: {
        name: 'inc'
      , symbol: '+'
      , description: 'Increments the destination by 1.'
      , url: 'http://www.c-jump.com/CIS77/ASM/Assembly/lecture.html#A77_0240_inc_and_dec'
    }
  , dec: {
        name: 'dec'
      , symbol: '-'
      , description: 'Decrements the destination by 1.'
      , url: 'http://www.c-jump.com/CIS77/ASM/Assembly/lecture.html#A77_0240_inc_and_dec'
    }
  , jmp: {
        name: 'jmp'
      , symbol: ''
      , description: 'Jumps to specified address'
      , url: 'TODO'
  }
  , mov: {
        name: 'mov'
      , symbol: ''
      , description: 'Moves source into destination.'
      , url: 'http://www.c-jump.com/CIS77/ASM/Assembly/lecture.html#A77_0220_todo'
    }
  , push: {
        name: 'push'
      , symbol: ''
      , description: 'Pushes destination onto the stack.'
      , url: 'https://courses.engr.illinois.edu/ece390/books/artofasm/CH06/CH06-1.html#HEADING1-160'
    }
  , pop: {
        name: 'pop'
      , symbol: ''
      , description: 'Pops value on top of the stack and stores it in the destination.'
      , url: 'https://courses.engr.illinois.edu/ece390/books/artofasm/CH06/CH06-1.html#HEADING1-160'
    }
}
