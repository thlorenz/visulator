; vim: ft=nasm

section .text
global _start
_start:
  nop
.gai_s:
  mov eax, 0x1
  not eax

  mov ecx, 0x1
  not ecx

  mov ebx, 0x1
  not ebx

  mov edx, 0x1
  not edx

  mov esp, 0x1
  not esp

  mov ebp, 0x1
  not ebp

  mov esi, 0x1
  not esi

  mov edi, 0x1
  not edi

  mov eax, 0x2
  not eax

  mov ecx, 0x1
  not ecx

  mov ebx, 0x1
  not ebx

  mov edx, 0x0
  not edx

  ; edge cases
  mov ecx, 0x0
  not ecx

  mov ecx, 0xffffffff
  not ecx

  mov ecx, 0xffffffee
  not ecx

  mov ecx, 0xffffffaa
  not ecx

  mov edx, 0xffffffff
  not edx

  mov eax, 0xffffffff
  not eax

  mov eax, 0xffff8888
  not eax

  mov eax, 0xffff7777
  not eax
.gai_e:
  mov eax,1
  mov ebx,0
  int 80H
