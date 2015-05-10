; vim: ft=nasm

section .text
global _start
_start:
  nop
.gai_s:
  ; movi_w has to work for this of course
  mov ax, 0x10
  mov ax, ax
  mov cx, ax
  mov dx, ax
  mov bx, ax
  mov sp, ax
  mov bp, ax
  mov si, ax
  mov di, ax

  mov cx, 0x20
  mov ax, cx
  mov cx, cx
  mov dx, cx
  mov bx, cx
  mov sp, cx
  mov bp, cx
  mov si, cx
  mov di, cx

  mov dx, 0x30
  mov ax, dx
  mov cx, dx
  mov dx, dx
  mov bx, dx
  mov sp, dx
  mov bp, dx
  mov si, dx
  mov di, dx

  mov bx, 0x40
  mov ax, bx
  mov cx, bx
  mov dx, bx
  mov bx, bx
  mov sp, bx
  mov bp, bx
  mov si, bx
  mov di, bx

  mov sp, 0x50
  mov ax, sp
  mov cx, sp
  mov dx, sp
  mov bx, sp
  mov sp, sp
  mov bp, sp
  mov si, sp
  mov di, sp

  mov bp, 0x60
  mov ax, bp
  mov cx, bp
  mov dx, bp
  mov bx, bp
  mov sp, bp
  mov bp, bp
  mov si, bp
  mov di, bp

  mov si, 0x70
  mov ax, si
  mov cx, si
  mov dx, si
  mov bx, si
  mov sp, si
  mov bp, si
  mov si, si
  mov di, si

  mov di, 0x80
  mov ax, di
  mov cx, di
  mov dx, di
  mov bx, di
  mov sp, di
  mov bp, di
  mov si, di
  mov di, di
.gai_e:
  mov eax,1
  mov ebx,0
  int 80H
