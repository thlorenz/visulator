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
  xor ah, ah
  xor ah, ch
  xor ah, bh
  xor ah, dh
  xor ah, al
  xor ah, cl
  xor ah, bl
  xor ah, dl

  mov al, 0x1
  xor al, ah
  xor al, ch
  xor al, bh
  xor al, dh
  xor al, al
  xor al, cl
  xor al, bl
  xor al, dl

  mov ch, 0x1
  xor ch, ah
  xor ch, ch
  xor ch, bh
  xor ch, dh
  xor ch, al
  xor ch, cl
  xor ch, bl
  xor ch, dl

  mov cl, 0x1
  xor cl, ah
  xor cl, ch
  xor cl, bh
  xor cl, dh
  xor cl, al
  xor cl, cl
  xor cl, bl
  xor cl, dl

  mov dh, 0x1
  xor dh, ah
  xor dh, ch
  xor dh, bh
  xor dh, dh
  xor dh, al
  xor dh, cl
  xor dh, bl
  xor dh, dl

  mov dl, 0x1
  xor dl, ah
  xor dl, ch
  xor dl, bh
  xor dl, dh
  xor dl, al
  xor dl, cl
  xor dl, bl
  xor dl, dl

  mov bh, 0x1
  xor bh, ah
  xor bh, ch
  xor bh, bh
  xor bh, dh
  xor bh, al
  xor bh, cl
  xor bh, bl
  xor bh, dl

  mov bl, 0x1
  xor bl, ah
  xor bl, ch
  xor bl, bh
  xor bl, dh
  xor bl, al
  xor bl, cl
  xor bl, bl
  xor bl, dl

  mov ah, 01
  mov bh, 02
  mov ch, 01

  xor ah, bh
  xor ah, ch

  mov al, 01
  mov bl, 02
  mov cl, 01

  xor al, bl
  xor al, cl

.gai_e:
  mov eax,1
  mov ebx,0
  int 80H
