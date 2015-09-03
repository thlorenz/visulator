; vim: ft=nasm

section .text
global _start
_start:
  nop
.gai_s:
  mov eax, 0x1
  neg eax

  mov ecx, 0x1
  neg ecx

  mov ebx, 0x1
  neg ebx

  mov edx, 0x1
  neg edx

  mov esp, 0x1
  neg esp

  mov ebp, 0x1
  neg ebp

  mov esi, 0x1
  neg esi

  mov edi, 0x1
  neg edi

  mov eax, 0x2
  neg eax

  mov ecx, 0x1
  neg ecx

  mov ebx, 0x1
  neg ebx

  mov edx, 0x0
  neg edx

  ; edge cases
  mov ecx, 0x0
  neg ecx

  mov ecx, 0xffffffff
  neg ecx

  mov ecx, 0xffffffee
  neg ecx

  mov ecx, 0xffffffaa
  neg ecx

  mov edx, 0xffffffff
  neg edx

  mov eax, 0xffffffff
  neg eax

  mov eax, 0xffff8888
  neg eax

  mov eax, 0xffff7777
  neg eax
.gai_e:
  mov eax,1
  mov ebx,0
  int 80H
