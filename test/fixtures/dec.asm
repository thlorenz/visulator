; vim: ft=nasm

section .text
global _start
_start:
  nop
.gai_s:
  mov eax, 0x2      ; EAX: 0x2 - IF
  dec eax           ; EAX: 0x1 - IF
  dec eax           ; EAX: 0x0 - PF ZF IF

  dec eax           ; EAX: 0xffffffff - PF AF SF IF
  dec eax           ; EAX: 0xfffffffe - SF IF

.gai_e:
  mov eax,1
  mov ebx,0
  int 80H
