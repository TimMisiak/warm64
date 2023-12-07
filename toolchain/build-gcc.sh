#!/bin/bash
set -e

cd /gcc/src

# Start building the cross-compiler
mkdir build-binutils
cd build-binutils
../binutils-latest/configure --target=$TARGET --prefix="$PREFIX" --with-sysroot --disable-nls --disable-werror
make
make install

# Adjust PATH to include the cross-compiler
export PATH="$PREFIX/bin:$PATH"

# Build GCC
cd /gcc/src
mkdir build-gcc
cd build-gcc
../gcc-latest/configure --target=$TARGET --prefix="$PREFIX" --disable-nls --enable-languages=c,c++ --without-headers
make all-gcc
make all-target-libgcc
make install-gcc
make install-target-libgcc

echo "Cross-compiler for $TARGET installed successfully."
