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
  and ax, ax
  and ax, cx
  and ax, bx
  and ax, dx
  and ax, sp
  and ax, bp
  and ax, di
  and ax, si

  mov cx, 0x1
  and cx, ax
  and cx, cx
  and cx, bx
  and cx, dx
  and cx, sp
  and cx, bp
  and cx, di
  and cx, si

  mov dx, 0x1
  and dx, ax
  and dx, cx
  and dx, bx
  and dx, dx
  and dx, sp
  and dx, bp
  and dx, di
  and dx, si

  mov bx, 0x1
  and bx, ax
  and bx, cx
  and bx, bx
  and bx, dx
  and bx, sp
  and bx, bp
  and bx, di
  and bx, si

  mov sp, 0x1
  and sp, ax
  and sp, cx
  and sp, bx
  and sp, dx
  and sp, sp
  and sp, bp
  and sp, di
  and sp, si

  mov bp, 0x1
  and bp, ax
  and bp, cx
  and bp, bx
  and bp, dx
  and bp, sp
  and bp, bp
  and bp, di
  and bp, si

  mov si, 0x1
  and si, ax
  and si, cx
  and si, bx
  and si, dx
  and si, sp
  and si, bp
  and si, di
  and si, si

  mov di, 0x1
  and di, ax
  and di, cx
  and di, bx
  and di, dx
  and di, sp
  and di, bp
  and di, di
  and di, si

  mov ax, 01
  mov bx, 02
  mov cx, 01

  and ax, bx
  and ax, cx
.gai_e:

  mov eax,1
  mov ebx,0
  int 80H
