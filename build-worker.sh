#!/bin/bash

set -e

path=src/worker

npm run build -- \
  -i $path/worker.ts \
  -o $path/temp.umd.js \
  -f umd \
  --tsconfig $path/tsconfig.json \
  --external none

rm -f $path/inline-worker.js
touch $path/inline-worker.js

echo 'export default URL.createObjectURL(new Blob([`' >> $path/inline-worker.js
cat $path/temp.umd.js >> $path/inline-worker.js
echo '`], { type: "text/javascript" }));' >> $path/inline-worker.js

rm -f $path/temp.umd.js
# FIXME: don't generate these files:
rm -f $path/temp.umd.js.map
rm -rf $path/worker