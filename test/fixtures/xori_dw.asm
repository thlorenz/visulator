; vim: ft=nasm

section .text
global _start
_start:
  nop
.gai_s:
  mov eax, 0x1
  xor eax, 0x1

  mov ecx, 0x1
  xor ecx, 0x1

  mov ebx, 0x1
  xor ebx, 0x1

  mov edx, 0x1
  xor edx, 0x1

  mov esp, 0x1
  xor esp, 0x1

  mov ebp, 0x1
  xor ebp, 0x1

  mov esi, 0x1
  xor esi, 0x1

  mov edi, 0x1
  xor edi, 0x1

  mov eax, 0x2
  xor eax, 0x1

  mov ecx, 0x1
  xor ecx, 0x2

  mov ebx, 0x1
  xor ebx, 0x3

  mov edx, 0x0
  xor edx, 0x1

  ; edge cases
  mov ecx, 0x0
  xor ecx, 0xffffffff   ; should set SF

  mov ecx, 0x0
  xor ecx, 0xffff

  mov ecx, 0x0
  xor ecx, 0xffffffaa

  mov ecx, 0x0
  xor ecx, 0xffffff88 ;-> 66 83 c9 88    (only lower word included, needs to be filled with ff)

  mov ecx, 0x0
  xor ecx, 0xffffff77 ;-> 66 81 c9 77 ff (full word included)

  mov ecx, 0x0
  xor ecx, 0xffffff22

  mov ecx, 0x11aaddee
  xor ecx, 0x22ffaaff   ; should set SF

  mov edx, 0x0
  xor edx, 0xffffffff   ; should set SF

  mov edx, 0x0
  xor edx, 0xffff

  mov edx, 0x11aaddee
  xor edx, 0x22ffaaff   ; should set SF

  mov eax, 0x0
  xor eax, 0xffffffff   ; should set SF

  mov eax, 0x0
  xor eax, 0xffff

  mov eax, 0x0
  xor eax, 0xffee

  mov eax, 0x11aaddee
  xor eax, 0x22ffaaff   ; should set SF
.gai_e:
  mov eax,1
  mov ebx,0
  int 80H
