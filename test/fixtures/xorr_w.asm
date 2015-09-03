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
  xor ax, ax
  xor ax, cx
  xor ax, bx
  xor ax, dx
  xor ax, sp
  xor ax, bp
  xor ax, di
  xor ax, si

  mov cx, 0x1
  xor cx, ax
  xor cx, cx
  xor cx, bx
  xor cx, dx
  xor cx, sp
  xor cx, bp
  xor cx, di
  xor cx, si

  mov dx, 0x1
  xor dx, ax
  xor dx, cx
  xor dx, bx
  xor dx, dx
  xor dx, sp
  xor dx, bp
  xor dx, di
  xor dx, si

  mov bx, 0x1
  xor bx, ax
  xor bx, cx
  xor bx, bx
  xor bx, dx
  xor bx, sp
  xor bx, bp
  xor bx, di
  xor bx, si

  mov sp, 0x1
  xor sp, ax
  xor sp, cx
  xor sp, bx
  xor sp, dx
  xor sp, sp
  xor sp, bp
  xor sp, di
  xor sp, si

  mov bp, 0x1
  xor bp, ax
  xor bp, cx
  xor bp, bx
  xor bp, dx
  xor bp, sp
  xor bp, bp
  xor bp, di
  xor bp, si

  mov si, 0x1
  xor si, ax
  xor si, cx
  xor si, bx
  xor si, dx
  xor si, sp
  xor si, bp
  xor si, di
  xor si, si

  mov di, 0x1
  xor di, ax
  xor di, cx
  xor di, bx
  xor di, dx
  xor di, sp
  xor di, bp
  xor di, di
  xor di, si

  mov ax, 0x1
  mov bx, 0x2
  mov cx, 0x1

  xor ax, bx
  xor ax, cx
.gai_e:

  mov eax,1
  mov ebx,0
  int 80H
