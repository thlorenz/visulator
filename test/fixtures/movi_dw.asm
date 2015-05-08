; vim: ft=nasm

section .text
global _start
_start:
  nop
.gai_s:
  mov eax, 0x1
  mov ecx, 0x2
  mov edx, 0x3
  mov ebx, 0x4
  mov esp, 0x5
  mov ebp, 0x6
  mov esi, 0x7
  mov edi, 0x8

  mov eax, 0x0 ; doesn't affect ZF
.gai_e:
  mov eax,1
  mov ebx,0
  int 80H
