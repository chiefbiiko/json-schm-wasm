import { loadWasm } from "./loadWasm.ts";

const encoder: TextEncoder = new TextEncoder();
const wasm: { [key: string]: any } = loadWasm();

export function isValid(
  instance: string | Uint8Array,
  schema: string | Uint8Array,
  validateSchema: boolean = true
): boolean {
  if (typeof instance === "string") {
    instance = encoder.encode(instance) as Uint8Array;
  }

  if (typeof schema === "string") {
    schema = encoder.encode(schema) as Uint8Array;
  }

  const instancePtr: number = wasm.__wbindgen_malloc(
    instance.byteLength + schema.byteLength
  );
  const schemaPtr: number = instancePtr + instance.byteLength;
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
