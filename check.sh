#!/usr/bin/env bash

set -Euo pipefail

./build.sh

if [[ $? -ne 0 ]]; then
  exit 1;
fi

cd ./test

echo "[check.sh] 🔬  running test suite"

date > ./test.stdx

echo "\n\n" > ./test.stdx 

FAILS=$(deno run --allow-read ./test.ts 2>&1 | tee -a ./test.stdx | grep "failures" | tr -d -c 0-9)

echo "[check.sh] 🏁  # of fails: $FAILS"

if [[ $FAILS -eq 0 ]]; then
  exit 0;
else
  exit 1;
fi
