#!/bin/bash
set -e
cd /home/kernel
mkdir -p bin
cargo build --target aarch64-unknown-none --release
aarch64-elf-as -c boot.S -o bin/boot.o
aarch64-elf-gcc -T linker.ld -o bin/warm64.elf -ffreestanding -O2 -nostdlib bin/boot.o target/aarch64-unknown-none/release/libwarm64.a -lgcc
aarch64-elf-objcopy bin/warm64.elf -O binary bin/warm64.img
#aarch64-elf-objdump -D warm64.elf