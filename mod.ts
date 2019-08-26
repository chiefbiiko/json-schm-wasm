import { loadWasm } from "./loadWasm.ts";

const encoder: TextEncoder = new TextEncoder();

const wasm: { [key: string]: any } = loadWasm();

export function isValid(
  instance: any,
  schema: any,
  validateSchema: boolean = true
): boolean {
  if (instance.constructor.name !== "Uint8Array") {
    if (typeof instance !== "string") {
      instance = JSON.stringify(instance);
    }

    instance = encoder.encode(instance);
  }

  if (schema.constructor.name !== "Uint8Array") {
    if (typeof schema !== "string") {
      schema = JSON.stringify(schema);
    }

    schema = encoder.encode(schema);
  }

  const instancePtr: number = wasm.__wbindgen_malloc(instance.byteLength);
  const schemaPtr: number = wasm.__wbindgen_malloc(schema.byteLength);

  const vue: Uint8Array = new Uint8Array(wasm.memory.buffer);

  vue.set(instance, instancePtr);
  vue.set(schema, schemaPtr);

  return !!wasm.is_valid(
    instancePtr,
    instance.byteLength,
    schemaPtr,
    schema.byteLength,
    validateSchema ? 1 : 0
  );
}
