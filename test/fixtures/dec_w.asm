; vim: ft=nasm

section .text
global _start
_start:
  nop
.gai_s:
  ; the below test boundary cases
  ; to make sure that the correct flags are set
  mov ax, 0x2      ; AX: 0x2 - IF
  dec ax           ; AX: 0x1 - IF
  dec ax           ; AX: 0x0 - PF ZF IF

  dec ax           ; AX: 0xffff - PF AF SF IF
  dec ax           ; AX: 0xfffe - SF IF

  ; we do this for two different regs just to be
  ; sure things do and should work the same way here
  mov si, 0x2      ; SI: 0x2 - IF
  dec si           ; SI: 0x1 - IF
  dec si           ; SI: 0x0 - PF ZF IF

  dec si           ; SI: 0xffff - PF AF SF IF
  dec si           ; SI: 0xfffe - SF IF

  ; below we just go through all regs
  ; to make sure dec is implemented for all of them
  mov ax, 0x1
  dec ax

  mov cx, 0x1
  dec cx

  mov dx, 0x1
  dec dx

  mov bx, 0x1
  dec bx

  mov sp, 0x1
  dec sp

  mov bp, 0x1
  dec bp

  mov si, 0x1
  dec si

  mov di, 0x1
  dec di

.gai_e:
  mov eax,1
  mov ebx,0
  int 80H
