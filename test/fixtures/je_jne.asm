; vim: ft=nasm

section .text
global _start
_start:
  nop
.gai_s:
  mov  ecx, 0x1
  test ecx, ecx
  je .zero

  mov  ecx, 0x0   ; should get here
  test ecx, ecx
  je .zero

  mov  ecx, 0x6   ; shouldn't get here

.zero:
   mov  ecx, 0x0
  ;test ecx, ecx
  ;jne .not_zero

  ;mov  ecx, 0x1   ; should get here
  ;test ecx, ecx
  ;jne .not_zero

  ;mov  ecx, 0x66   ; shouldn't get here

;.not_zero:
  ;mov  ecx, 0x0

.gai_e:
  mov  eax,1
  mov  ebx,0
  int 80H
