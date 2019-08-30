#!/usr/bin/env bash

set -Euo pipefail

./build.sh

cd ./test

echo "[check.sh] 🔬 running test suite"

fails=$(deno run --allow-read ./test.ts 2>&1 | grep "failures" | tr -d -c 0-9)

echo "[check.sh] 🏁 # of fails: $fails"

if [[ $fails = 0 ]]; then
  exit 0;
else  
  exit 1;
fi