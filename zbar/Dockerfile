FROM trzeci/emscripten:1.39.0

RUN apt-get update \
 && apt-get install autoconf libtool gettext autogen imagemagick libmagickcore-dev -y

# cd into the mounted host directory
WORKDIR /src

# clone the latest ZBar code from the Github repo
RUN git clone https://github.com/ZBar/ZBar

# cd into the directory
WORKDIR /src/ZBar

# Delete all -Werror strings from configure.ac
# Don't treat warnings as errors!
RUN sed -i "s/ -Werror//" $(pwd)/configure.ac

# Generate automake files
RUN autoreconf -i

# Configure: disable all unneccesary features
# This may produce red error messages, but it is safe to ignore them (it assumes that
# emscripten is GCC and uses invalid parameters on it)
RUN emconfigure ./configure --without-x --without-jpeg --without-imagemagick --without-npapi --without-gtk --without-python --without-qt --without-xshm --disable-video --disable-pthread

# Compile ZBar
RUN emmake make


WORKDIR /src

COPY scan.c library.js ./

RUN emcc -O3 \ 
-s MODULARIZE=1 \
-s EXPORT_ES6=1 \
-s WASM=1 \
-s EXTRA_EXPORTED_RUNTIME_METHODS='["cwrap", "UTF8ToString"]' \
--js-library ./library.js \
-I ./ZBar/include ./scan.c ./ZBar/zbar/.libs/libzbar.a