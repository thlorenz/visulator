; vim: ft=nasm

section .text
global _start
_start:
  nop
  
.gai_s:
  mov al, 0x1
  mov cl, 0x2
  mov dl, 0x3
  mov bl, 0x4

  mov ah, 0x1
  mov ch, 0x2
  mov dh, 0x3
  mov bh, 0x4
.gai_e:
  mov eax,1
  mov ebx,0
  int 80H
