; vim: ft=nasm

section .text
global _start
_start:
  nop
.gai_s:
  mov  eax, 0x0
  mov  ecx, 0x0
  mov  edx, 0x0
  mov  ebx, 0x0
  mov  esp, 0x0
  mov  ebp, 0x0
  mov  esi, 0x0
  mov  edi, 0x0

  mov  eax, 0x1
  test eax, eax
  test eax, ecx
  test eax, ebx
  test eax, edx
  test eax, esp
  test eax, ebp
  test eax, edi
  test eax, esi

  mov  ecx, 0x1
  test ecx, eax
  test ecx, ecx
  test ecx, ebx
  test ecx, edx
  test ecx, esp
  test ecx, ebp
  test ecx, edi
  test ecx, esi

  mov  edx, 0x1
  test edx, eax
  test edx, ecx
  test edx, ebx
  test edx, edx
  test edx, esp
  test edx, ebp
  test edx, edi
  test edx, esi

  mov  ebx, 0x1
  test ebx, eax
  test ebx, ecx
  test ebx, ebx
  test ebx, edx
  test ebx, esp
  test ebx, ebp
  test ebx, edi
  test ebx, esi

  mov  esp, 0x1
  test esp, eax
  test esp, ecx
  test esp, ebx
  test esp, edx
  test esp, esp
  test esp, ebp
  test esp, edi
  test esp, esi

  mov  ebp, 0x1
  test ebp, eax
  test ebp, ecx
  test ebp, ebx
  test ebp, edx
  test ebp, esp
  test ebp, ebp
  test ebp, edi
  test ebp, esi

  mov  esi, 0x1
  test esi, eax
  test esi, ecx
  test esi, ebx
  test esi, edx
  test esi, esp
  test esi, ebp
  test esi, edi
  test esi, esi

  mov  edi, 0x1
  test edi, eax
  test edi, ecx
  test edi, ebx
  test edi, edx
  test edi, esp
  test edi, ebp
  test edi, edi
  test edi, esi

  mov  eax, 01
  mov  ebx, 02
  mov  ecx, 01

  test eax, ebx
  test eax, ecx
.gai_e:

  mov  eax,1
  mov  ebx,0
  int 80H
