; vim: ft=nasm

section .text
global _start
_start:
  nop
.gai_s:
  ; the below test boundary cases
  ; to make sure that the correct flags are set
  mov ax, 0x7fff
  inc ax               ; sets sign bit and overflows
  inc ax               ; keeps sign bit

  mov ax, 0xffff
  inc ax
  inc ax

  ; below we just go through all regs
  ; to make sure inc is implemented for all of them
  mov ax, 0x1
  inc ax

  mov cx, 0x1
  inc cx

  mov dx, 0x1
  inc dx

  mov bx, 0x1
  inc bx

  mov sp, 0x1
  inc sp

  mov bp, 0x1
  inc bp

  mov si, 0x1
  inc si

  mov di, 0x1
  inc di

.gai_e:
  mov eax,1
  mov ebx,0
  int 80H
