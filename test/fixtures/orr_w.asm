; vim: ft=nasm

section .text
global _start
_start:
  nop
.gai_s:
  mov ax, 0x0
  mov cx, 0x0
  mov dx, 0x0
  mov bx, 0x0
  mov sp, 0x0
  mov bp, 0x0
  mov si, 0x0
  mov di, 0x0

  mov ax, 0x1
  or  ax, ax
  or  ax, cx
  or  ax, bx
  or  ax, dx
  or  ax, sp
  or  ax, bp
  or  ax, di
  or  ax, si

  mov cx, 0x1
  or  cx, ax
  or  cx, cx
  or  cx, bx
  or  cx, dx
  or  cx, sp
  or  cx, bp
  or  cx, di
  or  cx, si

  mov dx, 0x1
  or  dx, ax
  or  dx, cx
  or  dx, bx
  or  dx, dx
  or  dx, sp
  or  dx, bp
  or  dx, di
  or  dx, si

  mov bx, 0x1
  or  bx, ax
  or  bx, cx
  or  bx, bx
  or  bx, dx
  or  bx, sp
  or  bx, bp
  or  bx, di
  or  bx, si

  mov sp, 0x1
  or  sp, ax
  or  sp, cx
  or  sp, bx
  or  sp, dx
  or  sp, sp
  or  sp, bp
  or  sp, di
  or  sp, si

  mov bp, 0x1
  or  bp, ax
  or  bp, cx
  or  bp, bx
  or  bp, dx
  or  bp, sp
  or  bp, bp
  or  bp, di
  or  bp, si

  mov si, 0x1
  or  si, ax
  or  si, cx
  or  si, bx
  or  si, dx
  or  si, sp
  or  si, bp
  or  si, di
  or  si, si

  mov di, 0x1
  or  di, ax
  or  di, cx
  or  di, bx
  or  di, dx
  or  di, sp
  or  di, bp
  or  di, di
  or  di, si

  mov ax, 0x1
  mov bx, 0x2
  mov cx, 0x1

  or  ax, bx
  or  ax, cx
.gai_e:

  mov eax,1
  mov ebx,0
  int 80H
