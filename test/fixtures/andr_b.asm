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
  and ah, ah
  and ah, ch
  and ah, bh
  and ah, dh
  and ah, al
  and ah, cl
  and ah, bl
  and ah, dl

  mov al, 0x1
  and al, ah
  and al, ch
  and al, bh
  and al, dh
  and al, al
  and al, cl
  and al, bl
  and al, dl

  mov ch, 0x1
  and ch, ah
  and ch, ch
  and ch, bh
  and ch, dh
  and ch, al
  and ch, cl
  and ch, bl
  and ch, dl

  mov cl, 0x1
  and cl, ah
  and cl, ch
  and cl, bh
  and cl, dh
  and cl, al
  and cl, cl
  and cl, bl
  and cl, dl

  mov dh, 0x1
  and dh, ah
  and dh, ch
  and dh, bh
  and dh, dh
  and dh, al
  and dh, cl
  and dh, bl
  and dh, dl

  mov dl, 0x1
  and dl, ah
  and dl, ch
  and dl, bh
  and dl, dh
  and dl, al
  and dl, cl
  and dl, bl
  and dl, dl

  mov bh, 0x1
  and bh, ah
  and bh, ch
  and bh, bh
  and bh, dh
  and bh, al
  and bh, cl
  and bh, bl
  and bh, dl

  mov bl, 0x1
  and bl, ah
  and bl, ch
  and bl, bh
  and bl, dh
  and bl, al
  and bl, cl
  and bl, bl
  and bl, dl

  mov ah, 01
  mov bh, 02
  mov ch, 01

  and ah, bh
  and ah, ch

  mov al, 01
  mov bl, 02
  mov cl, 01

  and al, bl
  and al, cl

.gai_e:
  mov eax,1
  mov ebx,0
  int 80H
