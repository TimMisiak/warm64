docker build toolchain -t build-env
docker run -v .:/home build-env /home/kernel/build-kernel.sh
copy kernel/bin/warm64.img www/warm64.img
docker build www -t warm64-server