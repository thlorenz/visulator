; vim: ft=nasm

section .text
global _start
_start:
  nop
.gai_s:
  ; the below test boundary cases
  ; to make sure that the correct flags are set
  mov ah, 0x2      ; AH: 0x2 - IF
  dec ah           ; AH: 0x1 - IF
  dec ah           ; AH: 0x0 - PF ZF IF

  dec ah           ; AH: 0xff - PF AF SF IF
  dec ah           ; AH: 0xfe - SF IF

  ; we do this for two different regs just to be
  ; sure things do and should work the same way here
  mov al, 0x2      ; SI: 0x2 - IF
  dec al           ; SI: 0x1 - IF
  dec al           ; SI: 0x0 - PF ZF IF

  dec al           ; SI: 0xff - PF AF SF IF
  dec al           ; SI: 0xfe - SF IF

  ; below we just go through all regs
  ; to make sure dec is implemented for all of them
  mov al, 0x1
  dec al
  mov cl, 0x1
  dec cl
  mov dl, 0x1
  dec dl
  mov bl, 0x1
  dec bl

  mov ah, 0x1
  dec ah
  mov ch, 0x1
  dec ch
  mov dh, 0x1
  dec dh
  mov bh, 0x1
  dec bh

.gai_e:
  mov eax,1
  mov ebx,0
  int 80H
