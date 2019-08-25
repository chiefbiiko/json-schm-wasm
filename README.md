# json-schm-wasm

JSON schema validation with `WebAssembly`.

⁉️ 🔨 still cooking - any JSON containing `null` will yield INVALID. 

`->` Make sure your schemas do not specify `null` values and that you are fine with rejecting JSON containing `null`s.

## Usage

``` ts
import { isValid } from "https://denopkg.com/chiefbiiko/json-schm-wasm/mod.ts";

isValid("419", '{"type":"number"}') // true
```