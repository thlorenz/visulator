; vim: ft=nasm

section .text
global _start
_start:
  nop
.gai_s:
  ; the below test boundary cases
  ; to make sure that the correct flags are set
  mov eax, 0x2      ; EAX: 0x2 - IF
  dec eax           ; EAX: 0x1 - IF
  dec eax           ; EAX: 0x0 - PF ZF IF

  dec eax           ; EAX: 0xffffffff - PF AF SF IF
  dec eax           ; EAX: 0xfffffffe - SF IF

  ; we do this for two different regs just to be
  ; sure things do and should work the same way here
  mov esi, 0x2      ; ESI: 0x2 - IF
  dec esi           ; ESI: 0x1 - IF
  dec esi           ; ESI: 0x0 - PF ZF IF

  dec esi           ; ESI: 0xffffffff - PF AF SF IF
  dec esi           ; ESI: 0xfffffffe - SF IF

  ; below we just go through all regs
  ; to make sure dec is implemented for all of them
  mov eax, 0x1
  dec eax

  mov ecx, 0x1
  dec ecx

  mov edx, 0x1
  dec edx

  mov ebx, 0x1
  dec ebx

  mov esp, 0x1
  dec esp

  mov ebp, 0x1
  dec ebp

  mov esi, 0x1
  dec esi

  mov edi, 0x1
  dec edi
.gai_e:
  mov eax,1
  mov ebx,0
  int 80H
