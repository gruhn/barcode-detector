#!/bin/bash

set -e

./node_modules/microbundle/dist/cli.js \
  -i src/DetectWorker.js \
  -o src/inline-worker.umd.js \
  -f umd \
  --sourcemap false \
  --external none

rm -f src/inline-worker-code.js
touch src/inline-worker-code.js

echo 'export default URL.createObjectURL(new Blob([`' >> src/inline-worker-code.js
cat src/inline-worker.umd.js >> src/inline-worker-code.js
echo '`], { type: "text/javascript" }));' >> src/inline-worker-code.js