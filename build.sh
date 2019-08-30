#!/usr/bin/env bash

set -Eeuo pipefail

WASM=./pkg/json_schm_wasm_bg.wasm

echo "[build.sh] ✂️  purging existing build artefacts"

rm -rf ./pkg ./target

cargo clean --manifest-path ./Cargo.toml
cargo clean --manifest-path ./wasm-valid/Cargo.toml

echo "[build.sh] 🔨  building wasm module"

wasm-pack build --no-typescript --release --mode force --target no-modules

if [[ $? -ne 0 ]]; then
  exit 1;
fi

BLAKESUM=$(blakesum $WASM)

echo "[build.sh] 📼  generating js glue code"

BASE64=$(base64 $WASM | tr -d "\t\r\n")

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

echo "[build.sh] 🎉  successful build wasm: @$WASM; blakesum: $BLAKESUM"
