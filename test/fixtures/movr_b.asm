; vim: ft=nasm

section .text
global _start
_start:
  nop
.gai_s:
  ; lower byte source
  mov al, 0x10
  mov al, al
  mov cl, al
  mov dl, al
  mov bl, al

  mov ah, al
  mov ch, al
  mov dh, al
  mov bh, al

  mov cl, 0x20
  mov al, cl
  mov cl, cl
  mov dl, cl
  mov bl, cl

  mov ah, cl
  mov ch, cl
  mov dh, cl
  mov bh, cl

  mov dl, 0x30
  mov al, dl
  mov cl, dl
  mov dl, dl
  mov bl, dl

  mov ah, dl
  mov ch, dl
  mov dh, dl
  mov bh, dl

  mov bl, 0x40
  mov al, bl
  mov cl, bl
  mov dl, bl
  mov bl, bl

  mov ah, bl
  mov ch, bl
  mov dh, bl
  mov bh, bl

  ; upper byte source
  mov ah, 0x11
  mov al, ah
  mov cl, ah
  mov dl, ah
  mov bl, ah

  mov ah, ah
  mov ch, ah
  mov dh, ah
  mov bh, ah

  mov ch, 0x22
  mov al, ch
  mov cl, ch
  mov dl, ch
  mov bl, ch

  mov ah, ch
  mov ch, ch
  mov dh, ch
  mov bh, ch

  mov dh, 0x33
  mov al, dh
  mov cl, dh
  mov dl, dh
  mov bl, dh

  mov ah, dh
  mov ch, dh
  mov dh, dh
  mov bh, dh

  mov bh, 0x44
  mov al, bh
  mov cl, bh
  mov dl, bh
  mov bl, bh

  mov ah, bh
  mov ch, bh
  mov dh, bh
  mov bh, bh
.gai_e:
  mov eax,1
  mov ebx,0
  int 80H
