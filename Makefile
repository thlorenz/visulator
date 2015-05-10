
DIR:=$(strip $(shell dirname $(realpath $(lastword $(MAKEFILE_LIST)))))

SRCS=$(wildcard $(DIR)/test/fixtures/*.asm)
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

fixtures: $(EXECS)
	for f in $(EXECS); do 							\
		gai-json $$f > $$f.json;	\
	done

p-%: fixtures 
	gai-print $(DIR)/test/fixtures/$(subst p-,,$@)

.SUFFIXES: .asm .o
.asm.o:
	nasm -f $(NASM_FMT) -g $(DBGI) $< -o $@

.o:
	ld $(LD_EMM) -o $@ $^

clean:
	@rm -f $(OBJS) $(EXECS) peda-session-*.txt .gdb_history

.PHONY: all clean
