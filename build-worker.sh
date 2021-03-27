#!/bin/bash

set -e

path=src/detectors/workers

npm run build -- \
  -i $path/jsqr/worker.ts \
  -o $path/jsqr/temp.umd.js \
  -f umd \
  --tsconfig $path/tsconfig.json \
  --external none

rm -f $path/jsqr/inline-worker.js
touch $path/jsqr/inline-worker.js

echo 'export default URL.createObjectURL(new Blob([`' >> $path/jsqr/inline-worker.js
cat $path/jsqr/temp.umd.js >> $path/jsqr/inline-worker.js
echo '`], { type: "text/javascript" }));' >> $path/jsqr/inline-worker.js

rm -f $path/jsqr/temp.umd.js
# FIXME: don't generate these files:
rm -f $path/jsqr/temp.umd.js.map
rm -rf $path/jsqr/detectors