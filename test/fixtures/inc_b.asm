; vim: ft=nasm

section .text
global _start
_start:
  nop
.gai_s:
  ; the below test boundary cases
  ; to make sure that the correct flags are set
  mov ah, 0x7f
  inc ah               ; sets sign bit and overflows
  inc ah               ; keeps sign bit

  mov al, 0xff
  inc al
  inc al

  mov ah, 0x7f
  inc ah               ; sets sign bit and overflows
  inc ah               ; keeps sign bit

  mov ah, 0xff
  inc ah
  inc ah

  ; below we just go through all regs
  ; to make sure inc is implemented for all of them
  mov al, 0x1
  inc al
  mov cl, 0x1
  inc cl
  mov dl, 0x1
  inc dl
  mov bl, 0x1
  inc bl

  mov ah, 0x1
  inc ah
  mov ch, 0x1
  inc ch
  mov dh, 0x1
  inc dh
  mov bh, 0x1
  inc bh

.gai_e:
  mov eax,1
  mov ebx,0
  int 80H
