; vim: ft=nasm

section .text
global _start
_start:
  nop
.gai_s:
  mov eax, 0x7fffffff
  push eax
  mov ecx, 0x3

.loop:
  dec  ecx
  test ecx, ecx
  jne .loop

  add  cl, 0x3
  inc  ch

.gai_e:
  mov  eax,1
  mov  ebx,0
  int 80H
