SRCS=$(wildcard *.asm)
OBJS= $(subst .asm,.o, $(SRCS))
EXECS=$(subst .asm,, $(SRCS))
JSONS=$(subst .asm,.json, $(SRCS))

BITS:=32
ifeq ($(BITS),64)
NASM_FMT=elf64
LD_EMM=elf_x86_64
else
NASM_FMT=elf32
LD_EMM=elf_i386
endif

DBGI=dwarf

# This env var is picked up by the macro assembly step via `%ifenv id` to include `_start`
export $(MAKECMDGOALS)

.SUFFIXES: .asm .o
.asm.o:
	@nasm -f $(NASM_FMT) -g $< -o $@

.o:
	@ld -m $(LD_EMM) -o $@ $^

clean:
	@rm -f $(OBJS) $(EXECS) $(JSONS)

.PHONY: all clean
