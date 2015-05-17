; vim: ft=nasm

section .text
global _start
_start:
  nop
.gai_s:
  mov eax, 0x0
  mov ecx, 0x0
  mov edx, 0x0
  mov ebx, 0x0
  mov esp, 0x0
  mov ebp, 0x0
  mov esi, 0x0
  mov edi, 0x0
  ; add eax is special for word and greater adds
  ; since it's the accumulator
  add eax, 0x0ff1
  add eax, 0x0fffff01

  add ecx, 0x0ff1
  add edx, 0x0ff1
  add ebx, 0x0ff1
  add esp, 0x0ff1
  add ebp, 0x0ff1
  add esi, 0x0ff1
  add edi, 0x0ff1

  add ecx, 0x0fffff01
  add edx, 0x0fffff01
  add ebx, 0x0fffff01
  add esp, 0x0fffff01
  add ebp, 0x0fffff01
  add esi, 0x0fffff01
  add edi, 0x0fffff01

  add eax, 0x1
  add ecx, 0x1
  add edx, 0x1
  add ebx, 0x1
  add esp, 0x1
  add ebp, 0x1
  add esi, 0x1
  add edi, 0x1

  ; the below test boundary cases
  ; to make sure that the correct flags are set
  mov eax, 0x7fffffff
  add eax, 0x1          ; sets sign bit and overflows
  add eax, 0x1          ; keeps sign bit

  mov eax, 0xffffffff
  add eax, 0x1
  add eax, 0x1

  mov ebx, 0x7fffffff
  add ebx, 0x1          ; sets sign bit and overflows
  add ebx, 0x1          ; keeps sign bit

  mov ebx, 0xffffffff
  add ebx, 0x1
  add ebx, 0x1

  mov eax, 0x6fffffff
  add eax, 0x2          ; sets sign bit and overflows
  add eax, 0x2          ; keeps sign bit

  mov eax, 0xfffffffe
  add eax, 0x2
  add eax, 0x2

  mov ecx, 0x6fffffff
  add ecx, 0x2          ; sets sign bit and overflows
  add ecx, 0x2          ; keeps sign bit

  mov ecx, 0xfffffffd
  add ecx, 0x3
  add ecx, 0x5
.gai_e:


  mov eax,1
  mov ebx,0
  int 80H
