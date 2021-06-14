#!/bin/bash

set +e

pushd $(dirname $0)

../../node_modules/.bin/microbundle \
  --entry worker.ts \
  --output temp.umd.js \
  --format umd \
  --tsconfig tsconfig.json \
  --sourcemap false \
  --generateTypes false \
  --external none

rm -f inline-worker.js
touch inline-worker.js

echo 'export default URL.createObjectURL(new Blob([`' >> inline-worker.js
cat temp.umd.js >> inline-worker.js
echo '`], { type: "text/javascript" }));' >> inline-worker.js

rm -f temp.umd.js
# FIXME: don't generate these files:
rm -rf worker

popd