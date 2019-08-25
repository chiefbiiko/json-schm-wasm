import { toUint8Array } from "https://deno.land/x/base64/mod.ts";

export function loadWasm(): { [key: string]: any } {
  return new WebAssembly.Instance(
    new WebAssembly.Module(
      toUint8Array(
      )
    )
  ).exports;
}