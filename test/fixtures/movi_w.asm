; vim: ft=nasm

section .text
global _start
_start:
  nop
.gai_s:
  mov ax, 0x1
  mov cx, 0x2
  mov dx, 0x3
  mov bx, 0x4
  mov sp, 0x5
  mov bp, 0x6
  mov si, 0x7
  mov di, 0x8
.gai_e:
  mov eax,1
  mov ebx,0
  int 80H
