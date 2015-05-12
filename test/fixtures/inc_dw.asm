; vim: ft=nasm

section .text
global _start
_start:
  nop
.gai_s:
  ; the below test boundary cases
  ; to make sure that the correct flags are set
  mov eax, 0x7fffffff
  inc eax               ; sets sign bit and overflows
  inc eax               ; keeps sign bit

  mov eax, 0xffffffff
  inc eax
  inc eax

  ;; we do this for two different regs just to be
  ;; sure things do and should work the same way here
  mov esi, 0x2
  inc esi
  inc esi

  inc esi
  inc esi

  ; below we just go through all regs
  ; to make sure dec is implemented for all of them
  mov eax, 0x1
  inc eax

  mov ecx, 0x1
  inc ecx

  mov edx, 0x1
  inc edx

  mov ebx, 0x1
  inc ebx

  mov esp, 0x1
  inc esp

  mov ebp, 0x1
  inc ebp

  mov esi, 0x1
  inc esi

  mov edi, 0x1
  inc edi
.gai_e:

  mov eax,1
  mov ebx,0
  int 80H
