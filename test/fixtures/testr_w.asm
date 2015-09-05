; vim: ft=nasm

section .text
global _start
_start:
  nop
.gai_s:
  mov  ax, 0x0
  mov  cx, 0x0
  mov  dx, 0x0
  mov  bx, 0x0
  mov  sp, 0x0
  mov  bp, 0x0
  mov  si, 0x0
  mov  di, 0x0

  mov  ax, 0x1
  test ax, ax
  test ax, cx
  test ax, bx
  test ax, dx
  test ax, sp
  test ax, bp
  test ax, di
  test ax, si

  mov  cx, 0x1
  test cx, ax
  test cx, cx
  test cx, bx
  test cx, dx
  test cx, sp
  test cx, bp
  test cx, di
  test cx, si

  mov  dx, 0x1
  test dx, ax
  test dx, cx
  test dx, bx
  test dx, dx
  test dx, sp
  test dx, bp
  test dx, di
  test dx, si

  mov  bx, 0x1
  test bx, ax
  test bx, cx
  test bx, bx
  test bx, dx
  test bx, sp
  test bx, bp
  test bx, di
  test bx, si

  mov  sp, 0x1
  test sp, ax
  test sp, cx
  test sp, bx
  test sp, dx
  test sp, sp
  test sp, bp
  test sp, di
  test sp, si

  mov  bp, 0x1
  test bp, ax
  test bp, cx
  test bp, bx
  test bp, dx
  test bp, sp
  test bp, bp
  test bp, di
  test bp, si

  mov  si, 0x1
  test si, ax
  test si, cx
  test si, bx
  test si, dx
  test si, sp
  test si, bp
  test si, di
  test si, si

  mov  di, 0x1
  test di, ax
  test di, cx
  test di, bx
  test di, dx
  test di, sp
  test di, bp
  test di, di
  test di, si

  mov  ax, 0x1
  mov  bx, 0x2
  mov  cx, 0x1

  test ax, bx
  test ax, cx
.gai_e:

  mov  eax,1
  mov  ebx,0
  int 80H
