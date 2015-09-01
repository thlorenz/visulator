; vim: ft=nasm

section .text
global _start
_start:
  nop
.gai_s:
  mov eax, 0x1
  or  eax, 0x1

  mov ecx, 0x1
  or  ecx, 0x1

  mov ebx, 0x1
  or  ebx, 0x1

  mov edx, 0x1
  or  edx, 0x1

  mov esp, 0x1
  or  esp, 0x1

  mov ebp, 0x1
  or  ebp, 0x1

  mov esi, 0x1
  or  esi, 0x1

  mov edi, 0x1
  or  edi, 0x1

  mov eax, 0x2
  or  eax, 0x1

  mov ecx, 0x1
  or  ecx, 0x2

  mov ebx, 0x1
  or  ebx, 0x3

  mov edx, 0x0
  or  edx, 0x1

  ; edge cases
  mov ecx, 0x0
  or  ecx, 0xffffffff   ; should set SF

  mov ecx, 0x0
  or  ecx, 0xffff

  mov ecx, 0x0
  or  ecx, 0xffffffaa

  mov ecx, 0x0
  or  ecx, 0xffffff88 ;-> 66 83 c9 88    (only lower word included, needs to be filled with ff)

  mov ecx, 0x0
  or  ecx, 0xffffff77 ;-> 66 81 c9 77 ff (full word included)

  mov ecx, 0x0
  or  ecx, 0xffffff22

  mov ecx, 0x11aaddee
  or  ecx, 0x22ffaaff   ; should set SF

  mov edx, 0x0
  or  edx, 0xffffffff   ; should set SF

  mov edx, 0x0
  or  edx, 0xffff

  mov edx, 0x11aaddee
  or  edx, 0x22ffaaff   ; should set SF

  mov eax, 0x0
  or  eax, 0xffffffff   ; should set SF

  mov eax, 0x0
  or  eax, 0xffff

  mov eax, 0x0
  or  eax, 0xffee

  mov eax, 0x11aaddee
  or  eax, 0x22ffaaff   ; should set SF
.gai_e:
  mov eax,1
  mov ebx,0
  int 80H
