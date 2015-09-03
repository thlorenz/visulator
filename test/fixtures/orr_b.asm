; vim: ft=nasm

section .text
global _start
_start:
  nop
.gai_s:
  mov ah, 0x0
  mov ch, 0x0
  mov dh, 0x0
  mov bh, 0x0

  mov al, 0x0
  mov cl, 0x0
  mov dl, 0x0
  mov bl, 0x0

  mov ah, 0x1
  or  ah, ah
  or  ah, ch
  or  ah, bh
  or  ah, dh
  or  ah, al
  or  ah, cl
  or  ah, bl
  or  ah, dl

  mov al, 0x1
  or  al, ah
  or  al, ch
  or  al, bh
  or  al, dh
  or  al, al
  or  al, cl
  or  al, bl
  or  al, dl

  mov ch, 0x1
  or  ch, ah
  or  ch, ch
  or  ch, bh
  or  ch, dh
  or  ch, al
  or  ch, cl
  or  ch, bl
  or  ch, dl

  mov cl, 0x1
  or  cl, ah
  or  cl, ch
  or  cl, bh
  or  cl, dh
  or  cl, al
  or  cl, cl
  or  cl, bl
  or  cl, dl

  mov dh, 0x1
  or  dh, ah
  or  dh, ch
  or  dh, bh
  or  dh, dh
  or  dh, al
  or  dh, cl
  or  dh, bl
  or  dh, dl

  mov dl, 0x1
  or  dl, ah
  or  dl, ch
  or  dl, bh
  or  dl, dh
  or  dl, al
  or  dl, cl
  or  dl, bl
  or  dl, dl

  mov bh, 0x1
  or  bh, ah
  or  bh, ch
  or  bh, bh
  or  bh, dh
  or  bh, al
  or  bh, cl
  or  bh, bl
  or  bh, dl

  mov bl, 0x1
  or  bl, ah
  or  bl, ch
  or  bl, bh
  or  bl, dh
  or  bl, al
  or  bl, cl
  or  bl, bl
  or  bl, dl

  mov ah, 01
  mov bh, 02
  mov ch, 01

  or  ah, bh
  or  ah, ch

  mov al, 01
  mov bl, 02
  mov cl, 01

  or  al, bl
  or  al, cl

.gai_e:
  mov eax,1
  mov ebx,0
  int 80H
