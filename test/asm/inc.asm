; vim: ft=nasm

section .text
global _start
; Initially all regs are 0x0 except for ESP and EIP
; EFLAGs are 0x202 (INTERRUPT flag set -- IF) and a reserved one?
_start:
  nop

  inc eax               ; EAX: 0x1 - IF 
  inc eax               ; EAX: 0x2 - IF 

  mov eax, 0xffffffff   ; EAX: 0xffffffff - IF 
  inc eax               ; EAX: 0x0        - PF AF ZF IF
  inc eax               ; EAX: 0x1        - IF

  mov eax,1
  mov ebx,0
  int 80H
