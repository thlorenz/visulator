; vim: ft=nasm

section .text
global _start
_start:
  nop
.gai_s:
  mov eax, 0x0
  mov ecx, 0x0
  mov edx, 0x0
  mov ebx, 0x0
  mov esp, 0x0
  mov ebp, 0x0
  mov esi, 0x0
  mov edi, 0x0

  mov eax, 0x1
  or  eax, eax
  or  eax, ecx
  or  eax, ebx
  or  eax, edx
  or  eax, esp
  or  eax, ebp
  or  eax, edi
  or  eax, esi

  mov ecx, 0x1
  or  ecx, eax
  or  ecx, ecx
  or  ecx, ebx
  or  ecx, edx
  or  ecx, esp
  or  ecx, ebp
  or  ecx, edi
  or  ecx, esi

  mov edx, 0x1
  or  edx, eax
  or  edx, ecx
  or  edx, ebx
  or  edx, edx
  or  edx, esp
  or  edx, ebp
  or  edx, edi
  or  edx, esi

  mov ebx, 0x1
  or  ebx, eax
  or  ebx, ecx
  or  ebx, ebx
  or  ebx, edx
  or  ebx, esp
  or  ebx, ebp
  or  ebx, edi
  or  ebx, esi

  mov esp, 0x1
  or  esp, eax
  or  esp, ecx
  or  esp, ebx
  or  esp, edx
  or  esp, esp
  or  esp, ebp
  or  esp, edi
  or  esp, esi

  mov ebp, 0x1
  or  ebp, eax
  or  ebp, ecx
  or  ebp, ebx
  or  ebp, edx
  or  ebp, esp
  or  ebp, ebp
  or  ebp, edi
  or  ebp, esi

  mov esi, 0x1
  or  esi, eax
  or  esi, ecx
  or  esi, ebx
  or  esi, edx
  or  esi, esp
  or  esi, ebp
  or  esi, edi
  or  esi, esi

  mov edi, 0x1
  or  edi, eax
  or  edi, ecx
  or  edi, ebx
  or  edi, edx
  or  edi, esp
  or  edi, ebp
  or  edi, edi
  or  edi, esi

  mov eax, 01
  mov ebx, 02
  mov ecx, 01

  or  eax, ebx
  or  eax, ecx
.gai_e:

  mov eax,1
  mov ebx,0
  int 80H
