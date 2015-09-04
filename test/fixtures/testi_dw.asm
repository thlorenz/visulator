; vim: ft=nasm

section .text
global _start
_start:
  nop
.gai_s:
  mov  eax, 0x1
  test eax, 0x1

  mov  ecx, 0x1
  test ecx, 0x1

  mov  ebx, 0x1
  test ebx, 0x1

  mov  edx, 0x1
  test edx, 0x1

  mov  esp, 0x1
  test esp, 0x1

  mov  ebp, 0x1
  test ebp, 0x1

  mov  esi, 0x1
  test esi, 0x1

  mov  edi, 0x1
  test edi, 0x1

  mov  eax, 0x2
  test eax, 0x1

  mov  ecx, 0x1
  test ecx, 0x2

  mov  ebx, 0x1
  test ebx, 0x3

  mov  edx, 0x0
  test edx, 0x1

  ; edge cases
  mov  ecx, 0x0
  test ecx, 0xffffffff

  mov  ecx, 0x0
  test ecx, 0xffff

  mov  ecx, 0x0
  test ecx, 0xffffffaa

  mov  ecx, 0x0
  test ecx, 0xffffff88

  mov  ecx, 0x0
  test ecx, 0xffffff77

  mov  ecx, 0x0
  test ecx, 0xffffff22

  mov  ecx, 0x11aaddee
  test ecx, 0x22ffaaff

  mov  edx, 0x0
  test edx, 0xffffffff

  mov  edx, 0x0
  test edx, 0xffff

  mov  edx, 0x11aaddee
  test edx, 0x22ffaaff

  mov  eax, 0x0
  test eax, 0xffffffff

  mov  eax, 0x0
  test eax, 0xffff

  mov  eax, 0x0
  test eax, 0xffee

  mov  eax, 0x11aaddee
  test eax, 0x22ffaaff
.gai_e:
  mov  eax,1
  mov  ebx,0
  int 80H
