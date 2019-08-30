#!/usr/bin/env bash

set -Eeuo pipefail

wasm-pack build --no-typescript --release --mode force --target no-modules

BASE64=$(base64 $(ls -U ./target/wasm32-unknown-unknown/release/*.wasm | head -1) | tr -d "\t\r\n")

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