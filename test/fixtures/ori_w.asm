; vim: ft=nasm

section .text
global _start
_start:
  nop
.gai_s:
  mov ax, 0x1
  or  ax, 0x1

  mov cx, 0x1
  or  cx, 0x1

  mov bx, 0x1
  or  bx, 0x1

  mov dx, 0x1
  or  dx, 0x1

  mov sp, 0x1
  or  sp, 0x1

  mov bp, 0x1
  or  bp, 0x1

  mov si, 0x1
  or  si, 0x1

  mov di, 0x1
  or  di, 0x1

  mov ax, 0x2
  or  ax, 0x1

  mov cx, 0x1
  or  cx, 0x2

  mov bx, 0x1
  or  bx, 0x3

  mov dx, 0x0
  or  dx, 0x1

  ; edge cases
  mov cx, 0x0
  or  cx, 0xffff

  mov cx, 0x11aa
  or  cx, 0x22ff

  mov cx, 0x0
  or  cx, 0xffee

  mov cx, 0x0
  or  cx, 0xffaa

  mov cx, 0x0
  or  cx, 0xff88 ;-> 66 83 c9 88    (only lower word included, needs to be filled with ff)

  mov cx, 0x0
  or  cx, 0xff77 ;-> 66 81 c9 77 ff (full word included)

  mov cx, 0x0
  or  cx, 0xff22

  mov dx, 0x0
  or  dx, 0xffff

  mov dx, 0x11aa
  or  dx, 0x22ff

  mov ax, 0x0
  or  ax, 0xffff

  mov ax, 0x0
  or  ax, 0xffee

  mov ax, 0x0
  or  ax, 0xffaa

  mov ax, 0x0
  or  ax, 0xff88 ;-> 66 83 c8 88    (only lower word included, needs to be filled with ff)

  mov ax, 0x0
  or  ax, 0xff77 ;-> 66 0d 77 ff (different opcode and full word included)

.gai_e:
  mov eax,1
  mov ebx,0
  int 80H
