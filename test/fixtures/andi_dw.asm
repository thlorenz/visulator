; vim: ft=nasm

section .text
global _start
_start:
  nop
.gai_s:
  mov ecx, 0x1
  and ecx, 0x1
.gai_e:
  mov eax,1
  mov ebx,0
  int 80H
