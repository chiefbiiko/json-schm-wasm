#!/usr/bin/env bash

set -Eeuo pipefail

echo "[build.sh] 🔨 building wasm module"

wasm-pack build --no-typescript --release --mode force --target no-modules > /dev/null 2>&1

echo "[build.sh] 📼 generating js glue code"

BASE64=$(base64 $(ls -U ./pkg/*.wasm | head -1) | tr -d "\t\r\n")

LOADER="import { toUint8Array } from \"https://deno.land/x/base64/mod.ts\";

export function loadWasm(): { [key: string]: any } {
  return new WebAssembly.Instance(
    new WebAssembly.Module(
      toUint8Array(
        \"$BASE64\"
      )
    )
  ).exports;
}"

echo "$LOADER" > ./loadWasm.ts

echo "[build.sh] 🎉 successful build"