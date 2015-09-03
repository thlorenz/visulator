; vim: ft=nasm

section .text
global _start
_start:
  nop
.gai_s:
  mov ah, 0x1
  neg ah

  mov ch, 0x1
  neg ch

  mov bh, 0x1
  neg bh

  mov dh, 0x1
  neg dh

  mov al, 0x1
  neg al

  mov cl, 0x1
  neg cl

  mov bl, 0x1
  neg bl

  mov dl, 0x1
  neg dl

  mov ah, 0x2
  neg ah

  mov ch, 0x1
  neg ch

  mov bh, 0x1
  neg bh

  mov dh, 0x0
  neg dh

  mov ah, 0x2
  neg ah

  mov ch, 0x1
  neg ch

  mov bh, 0x1
  neg bh

  mov dh, 0x0
  neg dh

.gai_e:
  mov eax,1
  mov ebx,0
  int 80H
