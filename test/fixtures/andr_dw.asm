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
  and eax, eax
  and eax, ecx
  and eax, ebx
  and eax, edx
  and eax, esp
  and eax, ebp
  and eax, edi
  and eax, esi

  mov ecx, 0x1
  and ecx, eax
  and ecx, ecx
  and ecx, ebx
  and ecx, edx
  and ecx, esp
  and ecx, ebp
  and ecx, edi
  and ecx, esi

  mov edx, 0x1
  and edx, eax
  and edx, ecx
  and edx, ebx
  and edx, edx
  and edx, esp
  and edx, ebp
  and edx, edi
  and edx, esi

  mov ebx, 0x1
  and ebx, eax
  and ebx, ecx
  and ebx, ebx
  and ebx, edx
  and ebx, esp
  and ebx, ebp
  and ebx, edi
  and ebx, esi

  mov esp, 0x1
  and esp, eax
  and esp, ecx
  and esp, ebx
  and esp, edx
  and esp, esp
  and esp, ebp
  and esp, edi
  and esp, esi

  mov ebp, 0x1
  and ebp, eax
  and ebp, ecx
  and ebp, ebx
  and ebp, edx
  and ebp, esp
  and ebp, ebp
  and ebp, edi
  and ebp, esi

  mov esi, 0x1
  and esi, eax
  and esi, ecx
  and esi, ebx
  and esi, edx
  and esi, esp
  and esi, ebp
  and esi, edi
  and esi, esi

  mov edi, 0x1
  and edi, eax
  and edi, ecx
  and edi, ebx
  and edi, edx
  and edi, esp
  and edi, ebp
  and edi, edi
  and edi, esi

  mov eax, 01
  mov ebx, 02
  mov ecx, 01

  and eax, ebx
  and eax, ecx
.gai_e:

  mov eax,1
  mov ebx,0
  int 80H
