; vim: ft=nasm

section .text
global _start
_start:
  nop
.gai_s:
  mov ax, 0x1
  neg ax

  mov cx, 0x1
  neg cx

  mov bx, 0x1
  neg bx

  mov dx, 0x1
  neg dx

  mov sp, 0x1
  neg sp

  mov bp, 0x1
  neg bp

  mov si, 0x1
  neg si

  mov di, 0x1
  neg di

  mov ax, 0x2
  neg ax

  mov cx, 0x1
  neg cx

  mov bx, 0x1
  neg bx

  mov dx, 0x0
  neg dx

  ; edge cases
  mov cx, 0x0
  neg cx

  mov cx, 0xffff
  neg cx

  mov cx, 0xffee
  neg cx

  mov cx, 0xffaa
  neg cx

  mov dx, 0xffff
  neg dx

  mov ax, 0xffff
  neg ax

  mov ax, 0xff88
  neg ax

  mov ax, 0xff77
  neg ax
.gai_e:
  mov eax,1
  mov ebx,0
  int 80H
