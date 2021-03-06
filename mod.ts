import { loadWasm } from "./loadWasm.ts";

const encoder: TextEncoder = new TextEncoder();

const wasm: { [key: string]: any } = loadWasm();

export function isValid(
  instance: any,
  schema: any,
  validateSchema: boolean = true
): boolean {
  if (!instance || instance.constructor.name !== "Uint8Array") {
    if (typeof instance !== "string") {
      instance = JSON.stringify(instance);
    }

    instance = encoder.encode(instance);
  }

  if (!schema || schema.constructor.name !== "Uint8Array") {
    if (typeof schema !== "string") {
      schema = JSON.stringify(schema);
    }

    schema = encoder.encode(schema);
  }

  const instancePtr: number = wasm.__wbindgen_malloc(instance.byteLength);
  const schemaPtr: number = wasm.__wbindgen_malloc(schema.byteLength);

  const mem: Uint8Array = new Uint8Array(wasm.memory.buffer);

  mem.set(instance, instancePtr);
  mem.set(schema, schemaPtr);

  return !!wasm.is_valid(
    instancePtr,
    instance.byteLength,
    schemaPtr,
    schema.byteLength,
    validateSchema ? 1 : 0
  );
}
