; vim: ft=nasm

section .text
global _start
_start:
  nop
.gai_s:
  mov ax, 0x1
  mov cx, 0x1
  mov bx, 0x1
  jmp .label_uno

.label_tres:
  inc bx
  jmp .exit

.label_dos:
  inc cx
  jmp .label_tres

.label_uno:
  inc ax
  jmp .label_dos

.exit:
.gai_e:
  mov eax,1
  mov ebx,0
  int 80H
