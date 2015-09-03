; vim: ft=nasm

section .text
global _start
_start:
  nop
.gai_s:
  mov ax, 0x1
  not ax

  mov cx, 0x1
  not cx

  mov bx, 0x1
  not bx

  mov dx, 0x1
  not dx

  mov sp, 0x1
  not sp

  mov bp, 0x1
  not bp

  mov si, 0x1
  not si

  mov di, 0x1
  not di

  mov ax, 0x2
  not ax

  mov cx, 0x1
  not cx

  mov bx, 0x1
  not bx

  mov dx, 0x0
  not dx

  ; edge cases
  mov cx, 0x0
  not cx

  mov cx, 0xffff
  not cx

  mov cx, 0xffee
  not cx

  mov cx, 0xffaa
  not cx

  mov dx, 0xffff
  not dx

  mov ax, 0xffff
  not ax

  mov ax, 0xff88
  not ax

  mov ax, 0xff77
  not ax
.gai_e:
  mov eax,1
  mov ebx,0
  int 80H
