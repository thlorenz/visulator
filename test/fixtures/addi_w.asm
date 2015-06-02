; vim: ft=nasm

section .text
global _start
_start:
  nop
.gai_s:
  mov eax, 0x0
  mov ecx, 0x0
  mov edx, 0x0
  mov ebx, 0x0
  mov esp, 0x0
  mov ebp, 0x0
  mov esi, 0x0
  mov edi, 0x0
  ; add ax is special since it's the accumulator
  add ax, 0x0ff1

  add cx, 0x0ff1
  add dx, 0x0ff1
  add bx, 0x0ff1
  add sp, 0x0ff1
  add bp, 0x0ff1
  add si, 0x0ff1
  add di, 0x0ff1

  add ax, 0x1
  add cx, 0x1
  add dx, 0x1
  add bx, 0x1
  add sp, 0x1
  add bp, 0x1
  add si, 0x1
  add di, 0x1

  ; the below test boundary cases
  ; to make sure that the correct flags are set
  mov ax, 0x7fff
  add ax, 0x1          ; sets sign bit and overflows
  add ax, 0x1          ; keeps sign bit

  mov ax, 0xffff
  add ax, 0x1
  add ax, 0x1

  mov bx, 0x7fff
  add bx, 0x1          ; sets sign bit and overflows
  add bx, 0x1          ; keeps sign bit

  mov bx, 0xffff
  add bx, 0x1
  add bx, 0x1

  mov ax, 0x6fff
  add ax, 0x2          ; sets sign bit and overflows
  add ax, 0x2          ; keeps sign bit

  mov ax, 0xfffe
  add ax, 0x2
  add ax, 0x2

  mov cx, 0x6fff
  add cx, 0x2          ; sets sign bit and overflows
  add cx, 0x2          ; keeps sign bit

  mov cx, 0xfffd
  add cx, 0x3
  add cx, 0x5

.gai_e:
  mov eax,1
  mov ebx,0
  int 80H
