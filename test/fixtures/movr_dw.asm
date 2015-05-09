; vim: ft=nasm

section .text
global _start
_start:
  nop
.gai_s:
  ; movi_dw has to work for this of course
  mov eax, 0x10
  mov eax, eax
  mov ecx, eax
  mov edx, eax
  mov ebx, eax
  mov esp, eax
  mov ebp, eax
  mov esi, eax
  mov edi, eax

  mov ecx, 0x20
  mov eax, ecx
  mov ecx, ecx
  mov edx, ecx
  mov ebx, ecx
  mov esp, ecx
  mov ebp, ecx
  mov esi, ecx
  mov edi, ecx

  mov edx, 0x30
  mov eax, edx
  mov ecx, edx
  mov edx, edx
  mov ebx, edx
  mov esp, edx
  mov ebp, edx
  mov esi, edx
  mov edi, edx

  mov ebx, 0x40
  mov eax, ebx
  mov ecx, ebx
  mov edx, ebx
  mov ebx, ebx
  mov esp, ebx
  mov ebp, ebx
  mov esi, ebx
  mov edi, ebx

  mov esp, 0x50
  mov eax, esp
  mov ecx, esp
  mov edx, esp
  mov ebx, esp
  mov esp, esp
  mov ebp, esp
  mov esi, esp
  mov edi, esp

  mov ebp, 0x60
  mov eax, ebp
  mov ecx, ebp
  mov edx, ebp
  mov ebx, ebp
  mov esp, ebp
  mov ebp, ebp
  mov esi, ebp
  mov edi, ebp

  mov esi, 0x70
  mov eax, esi
  mov ecx, esi
  mov edx, esi
  mov ebx, esi
  mov esp, esi
  mov ebp, esi
  mov esi, esi
  mov edi, esi

  mov edi, 0x80
  mov eax, edi
  mov ecx, edi
  mov edx, edi
  mov ebx, edi
  mov esp, edi
  mov ebp, edi
  mov esi, edi
  mov edi, edi
.gai_e:
  mov eax,1
  mov ebx,0
  int 80H
