# warm64

Why use webassembly when you could use REAL assembly?

This project provides a way of building rust code to aarch64, and then running that aarch64 code inside the unicorn.js emulator. A basic MMIO system provides a way to interact with the DOM.

What's done:

* Docker container for cross-compilation
* Script for building the aarch64 code from a rust no_std library
* Load code in unicorn.js
* Create "MMIO" for basic text output

To do:

* Create MMIO for DOM interaction

# Quickstart

Use build.cmd to build the warm64-server docker container.
Use run.cmd to run the warm64-server container
Then navigate to http://localhost:8080 to view the app.

# Detailed build instructions

## Kernel

I've created a cross-architecture build environment docker container which should hopefully make the project easy to build. From the root of the repository, you can run this command:

```
docker build toolchain -t build-env
```

You can run the docker container interactively to have an arm64 build toolchain, or you can just execute the build script directly, which will build the rust code, bootstrap assembly routine, and convert the image into its final loadable form.

```
docker run -v .:/home build-env /home/kernel/build-kernel.sh
```

The final image is built as kernel/bin/warm64.img.

You can dump the assembly output using the elf image with:

```
aarch64-elf-objdump -d kernel/bin/warm64.elf
```

## Web

First you need to copy the kernel image into the web directory.

```
copy kernel/bin/warm64.img www/warm64.img
```

Then, build the warm64-server container:

```
docker build www -t warm64-server
```

## Running a local test server without docker

If you prefer running the server on a local python instance instead of using a docker container, you can do that too. From the www directory, run the following commands to set up the dependencies:

```
pip install pipx
pipx install poetry
pipx ensurepath
poetry install --no-root
```

To run:

```
poetry run python app.py
```

# FAQ

Q: Why?!

A: Why not?

# License

Parts of this project are released under the MIT license. Other parts are released under the GPLv2 license (so as to be compatible with the license of Unicorn.js)

Specifically:

    kernel -> MIT
    toolchain -> MIT
    host -> GPLv2

But really, this is a formality because no one should ever use this software for any sort of purpose.