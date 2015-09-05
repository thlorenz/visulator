; vim: ft=nasm

section .text
global _start
_start:
  nop
.gai_s:
  mov  ah, 0x0
  mov  ch, 0x0
  mov  dh, 0x0
  mov  bh, 0x0

  mov  al, 0x0
  mov  cl, 0x0
  mov  dl, 0x0
  mov  bl, 0x0

  mov  ah, 0x1
  test ah, ah
  test ah, ch
  test ah, bh
  test ah, dh
  test ah, al
  test ah, cl
  test ah, bl
  test ah, dl

  mov  al, 0x1
  test al, ah
  test al, ch
  test al, bh
  test al, dh
  test al, al
  test al, cl
  test al, bl
  test al, dl

  mov  ch, 0x1
  test ch, ah
  test ch, ch
  test ch, bh
  test ch, dh
  test ch, al
  test ch, cl
  test ch, bl
  test ch, dl

  mov  cl, 0x1
  test cl, ah
  test cl, ch
  test cl, bh
  test cl, dh
  test cl, al
  test cl, cl
  test cl, bl
  test cl, dl

  mov  dh, 0x1
  test dh, ah
  test dh, ch
  test dh, bh
  test dh, dh
  test dh, al
  test dh, cl
  test dh, bl
  test dh, dl

  mov  dl, 0x1
  test dl, ah
  test dl, ch
  test dl, bh
  test dl, dh
  test dl, al
  test dl, cl
  test dl, bl
  test dl, dl

  mov  bh, 0x1
  test bh, ah
  test bh, ch
  test bh, bh
  test bh, dh
  test bh, al
  test bh, cl
  test bh, bl
  test bh, dl

  mov  bl, 0x1
  test bl, ah
  test bl, ch
  test bl, bh
  test bl, dh
  test bl, al
  test bl, cl
  test bl, bl
  test bl, dl

  mov  ah, 01
  mov  bh, 02
  mov  ch, 01

  test ah, bh
  test ah, ch

  mov  al, 01
  mov  bl, 02
  mov  cl, 01

  test al, bl
  test al, cl

.gai_e:
  mov eax,1
  mov ebx,0
  int 80H
