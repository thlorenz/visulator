SRCS=$(wildcard *.asm)
OBJS= $(subst .asm,.o, $(SRCS))
EXECS=$(subst .asm,, $(SRCS))

OS:=Linux
BITS:=32

# OSX
ifeq ($(OS), OSX)
	DBGI=# nasm doesn't support any debug format compatible with macho :(
	NASM_FMT=macho32
	LD_EMM=-arch i386 -macosx_version_min 10.5 -no_pie -e _start
else
# LINUX
DBGI=-F dwarf
ifeq ($(BITS),64)
NASM_FMT=elf64
LD_EMM=-m elf_x86_64
else
NASM_FMT=elf32
LD_EMM=-m elf_i386
endif
endif


all:
	@echo "Please run make with a task, i.e.: \"make strlen\""
	@echo "In case you get any of the below errors, run: \"make clean\""
	@echo "  - \"multiple definition of '_start'\""
	@echo "  - \"cannot find entry symbol _start\""

.SUFFIXES: .asm .o
.asm.o:
	nasm -f $(NASM_FMT) -g $(DBGI) $< -o $@

.o:
	ld $(LD_EMM) -o $@ $^

# Targets
inc:

dec:
# End Targets

clean:
	@rm -f $(OBJS) $(EXECS) peda-session-*.txt .gdb_history

docs: $(SRCS)
	node ./tools/gen-api-dox.js && \
	./tools/node_modules/.bin/doctoc README.md

.PHONY: all clean
