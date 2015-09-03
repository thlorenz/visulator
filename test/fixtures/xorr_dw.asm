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
  xor eax, eax
  xor eax, ecx
  xor eax, ebx
  xor eax, edx
  xor eax, esp
  xor eax, ebp
  xor eax, edi
  xor eax, esi

  mov ecx, 0x1
  xor ecx, eax
  xor ecx, ecx
  xor ecx, ebx
  xor ecx, edx
  xor ecx, esp
  xor ecx, ebp
  xor ecx, edi
  xor ecx, esi

  mov edx, 0x1
  xor edx, eax
  xor edx, ecx
  xor edx, ebx
  xor edx, edx
  xor edx, esp
  xor edx, ebp
  xor edx, edi
  xor edx, esi

  mov ebx, 0x1
  xor ebx, eax
  xor ebx, ecx
  xor ebx, ebx
  xor ebx, edx
  xor ebx, esp
  xor ebx, ebp
  xor ebx, edi
  xor ebx, esi

  mov esp, 0x1
  xor esp, eax
  xor esp, ecx
  xor esp, ebx
  xor esp, edx
  xor esp, esp
  xor esp, ebp
  xor esp, edi
  xor esp, esi

  mov ebp, 0x1
  xor ebp, eax
  xor ebp, ecx
  xor ebp, ebx
  xor ebp, edx
  xor ebp, esp
  xor ebp, ebp
  xor ebp, edi
  xor ebp, esi

  mov esi, 0x1
  xor esi, eax
  xor esi, ecx
  xor esi, ebx
  xor esi, edx
  xor esi, esp
  xor esi, ebp
  xor esi, edi
  xor esi, esi

  mov edi, 0x1
  xor edi, eax
  xor edi, ecx
  xor edi, ebx
  xor edi, edx
  xor edi, esp
  xor edi, ebp
  xor edi, edi
  xor edi, esi

  mov eax, 01
  mov ebx, 02
  mov ecx, 01

  xor eax, ebx
  xor eax, ecx
.gai_e:

  mov eax,1
  mov ebx,0
  int 80H
