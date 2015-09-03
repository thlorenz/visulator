; vim: ft=nasm

section .text
global _start
_start:
  nop
.gai_s:
  mov ax, 0x1
  xor ax, 0x1

  mov cx, 0x1
  xor cx, 0x1

  mov bx, 0x1
  xor bx, 0x1

  mov dx, 0x1
  xor dx, 0x1

  mov sp, 0x1
  xor sp, 0x1

  mov bp, 0x1
  xor bp, 0x1

  mov si, 0x1
  xor si, 0x1

  mov di, 0x1
  xor di, 0x1

  mov ax, 0x2
  xor ax, 0x1

  mov cx, 0x1
  xor cx, 0x2

  mov bx, 0x1
  xor bx, 0x3

  mov dx, 0x0
  xor dx, 0x1

  ; edge cases
  mov cx, 0x0
  xor cx, 0xffff ; -> 66 83 f1 ff xor cx,0xffff (only lower word included, needs to be filled with ff)

  mov cx, 0x11aa
  xor cx, 0x22ff

  mov cx, 0x0
  xor cx, 0xffee

  mov cx, 0x0
  xor cx, 0xffaa

  mov cx, 0x0
  xor cx, 0xff88 ;-> 66 83 f1 88    (only lower word included, needs to be filled with ff)

  mov cx, 0x0
  xor cx, 0xff77 ;-> 66 81 f1 77 ff (full word included)

  mov cx, 0x0
  xor cx, 0xff22

  mov dx, 0x0
  xor dx, 0xffff

  mov dx, 0x11aa
  xor dx, 0x22ff

  mov ax, 0x0
  xor ax, 0xffff

  mov ax, 0x0
  xor ax, 0xffee

  mov ax, 0x0
  xor ax, 0xffaa

  mov ax, 0x0
  xor ax, 0xff88 ; (only lower word included, needs to be filled with ff)

  mov ax, 0x0
  xor ax, 0xff77 ; (different opcode and full word included)

.gai_e:
  mov eax,1
  mov ebx,0
  int 80H
