; vim: ft=nasm

section .text
global _start
_start:
  nop
.gai_s:
  mov ah, 0x1
  not ah

  mov ch, 0x1
  not ch

  mov bh, 0x1
  not bh

  mov dh, 0x1
  not dh

  mov al, 0x1
  not al

  mov cl, 0x1
  not cl

  mov bl, 0x1
  not bl

  mov dl, 0x1
  not dl

  mov ah, 0x2
  not ah

  mov ch, 0x1
  not ch

  mov bh, 0x1
  not bh

  mov dh, 0x0
  not dh

  mov ah, 0x2
  not ah

  mov ch, 0x1
  not ch

  mov bh, 0x1
  not bh

  mov dh, 0x0
  not dh
.gai_e:

  mov eax,1
  mov ebx,0
  int 80H
