; vim: ft=nasm

section .text
global _start
_start:
  nop
.gai_s:
  mov eax, 0x7fffffff
  add eax, 0x1          ; sets sign bit and overflows
  add eax, 0x1          ; keeps sign bit

  mov bl, 0x2      ; SI: 0x2 - IF
  dec bl           ; SI: 0x1 - IF
  dec bl           ; SI: 0x0 - PF ZF IF

  push ebx

  mov ax, 0x7fff
  inc ax               ; sets sign bit and overflows
  dec ax

  pop ebx

  add ax, 0x0ff1

  add cx, 0x0ff1
  add dx, 0x0ff1
  add bx, 0x0ff1
  add sp, 0x0ff1
  add bp, 0x0ff1
  add si, 0x0ff1
  add di, 0x0ff1

  inc edx
  dec ebx

  mov eax, edx
  mov ecx, ebx

.gai_e:
  mov eax,1
  mov ebx,0
  int 80H
