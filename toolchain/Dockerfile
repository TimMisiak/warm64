FROM ubuntu
RUN apt update
RUN apt install -y build-essential
RUN apt install -y bison flex libgmp3-dev libmpc-dev libmpfr-dev texinfo libisl-dev
RUN apt install -y wget


# Set up GCC/binutils for aarch64
RUN mkdir -p /gcc/src
WORKDIR /gcc/src
RUN wget https://ftp.gnu.org/gnu/gcc/gcc-13.2.0/gcc-13.2.0.tar.xz
RUN tar -xvf gcc-13.2.0.tar.xz
RUN wget https://ftp.gnu.org/gnu/binutils/binutils-2.41.tar.xz
RUN tar -xvf binutils-2.41.tar.xz

RUN rm *.tar.xz
RUN mv gcc-* gcc-latest
RUN mv binutils-* binutils-latest

ENV TARGET=aarch64-elf
ENV PREFIX="/opt/cross"

WORKDIR /tmp
COPY build-gcc.sh .
RUN ./build-gcc.sh

ENV PATH="/opt/cross/bin:$PATH"

# Set up rust for aarch64
RUN wget https://sh.rustup.rs -O - | bash -s -- -y
RUN echo 'source $HOME/.cargo/env' >> $HOME/.bashrc
ENV PATH="/root/.cargo/bin:${PATH}"
RUN rustup target add aarch64-unknown-none
WORKDIR /home
