; vim: ft=nasm

section .text
global _start
_start:
  nop
.gai_s:
  mov eax, 0xffffff
  mov ecx, 0xffffff
  mov edx, 0xffffff
  mov ebx, 0xffffff
  mov esp, 0xffffff
  mov ebp, 0xffffff
  mov esi, 0xffffff
  mov edi, 0xffffff
  ; add eax is special for word and greater adds
  ; since it's the accumulator
  ;sub eax, 0x0ff1
  ;sub eax, 0x0fffff01

  sub ecx, 0x0ff1
  sub edx, 0x0ff1
  sub ebx, 0x0ff1
  sub esp, 0x0ff1
  sub ebp, 0x0ff1
  sub esi, 0x0ff1
  sub edi, 0x0ff1

  sub ecx, 0x0fffff01
  sub edx, 0x0fffff01
  sub ebx, 0x0fffff01
  sub esp, 0x0fffff01
  sub ebp, 0x0fffff01
  sub esi, 0x0fffff01
  sub edi, 0x0fffff01

  sub edx, 0x1
  sub ebx, 0x1
  sub esp, 0x1
  sub ebp, 0x1
  sub esi, 0x1
  sub edi, 0x1

  ; the below test boundary cases
  ; to make sure that the correct flags are set
  ;mov eax, 0x7fffffff
  ;add eax, 0x1          ; sets sign bit and overflows
  ;add eax, 0x1          ; keeps sign bit

  ;mov eax, 0xffffffff
  ;add eax, 0x1
  ;add eax, 0x1

  ;mov ebx, 0x7fffffff
  ;add ebx, 0x1          ; sets sign bit and overflows
  ;add ebx, 0x1          ; keeps sign bit

  ;mov ebx, 0xffffffff
  ;add ebx, 0x1
  ;add ebx, 0x1

  ;mov eax, 0x6fffffff
  ;add eax, 0x2          ; sets sign bit and overflows
  ;add eax, 0x2          ; keeps sign bit

  ;mov eax, 0xfffffffe
  ;add eax, 0x2
  ;add eax, 0x2

  ;mov ecx, 0x6fffffff
  ;add ecx, 0x2          ; sets sign bit and overflows
  ;add ecx, 0x2          ; keeps sign bit

  ;mov ecx, 0xfffffffd
  ;add ecx, 0x3
  ;add ecx, 0x5
.gai_e:

  mov eax,1
  mov ebx,0
  int 80H
