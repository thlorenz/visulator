; vim: ft=nasm

section .text
global _start
_start:
  nop
.gai_s:
  mov ecx, 0x0

  add ecx, 0x11
  jo .overflow

  mov ecx, 0x0   ; should get here

  add ecx, 0x7fffffff
  jo .overflow

  mov cx, 0x1   ; shouldn't get here

.overflow:
  mov cx, 0x0

  or  cx, 0xffff
  jno .no_overflow

  mov cx, 0x0   ; should get here

  or  cx, 0x11
  jno .no_overflow

  mov cx, 0x1   ; shouldn't get here

.no_overflow:
  mov cx, 0x0

.gai_e:
  mov eax,1
  mov ebx,0
  int 80H
