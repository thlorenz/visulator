; vim: ft=nasm

section .text
global _start
_start:
  nop
.gai_s:
  mov eax, 0xffffff
  mov ecx, 0xffffff
  mov edx, 0xffffff
  mov ebx, 0xffffff
  mov esp, 0xffffff
  mov ebp, 0xffffff
  mov esi, 0xffffff
  mov edi, 0xffffff
  ; add eax is special for word and greater adds
  ; since it's the accumulator
  sub ax, 0x0ff1
  sub ax, 0x0f01

  sub cx, 0x0ff1
  sub dx, 0x0ff1
  sub bx, 0x0ff1
  sub sp, 0x0ff1
  sub bp, 0x0ff1
  sub si, 0x0ff1
  sub di, 0x0ff1

  sub cx, 0x0f01
  sub dx, 0x0f01
  sub bx, 0x0f01
  sub sp, 0x0f01
  sub bp, 0x0f01
  sub si, 0x0f01
  sub di, 0x0f01

  sub dx, 0x1
  sub bx, 0x1
  sub sp, 0x1
  sub bp, 0x1
  sub si, 0x1
  sub di, 0x1

  ; the below test boundary cases
  ; to make sure that the correct flags are set
  mov ax, 0x1
  sub ax, 0x1          ; sets sign bit and overflows
  sub ax, 0x1          ; keeps sign bit

  mov bx, 0x1
  sub bx, 0x1          ; sets sign bit and overflows
  sub bx, 0x1          ; keeps sign bit

  mov bx, 0x1
  sub bx, 0x1
  sub bx, 0x1

  mov ax, 0x3
  sub ax, 0x2          ; sets sign bit and overflows
  sub ax, 0x2          ; keeps sign bit

.gai_e:

  mov eax,1
  mov ebx,0
  int 80H
