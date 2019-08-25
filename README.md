# json-schm-wasm

[![Travis](http://img.shields.io/travis/chiefbiiko/json-schm-wasm.svg?style=flat)](http://travis-ci.org/chiefbiiko/json-schm-wasm) [![AppVeyor](https://ci.appveyor.com/api/projects/status/github/chiefbiiko/json-schm-wasm?branch=master&svg=true)](https://ci.appveyor.com/project/chiefbiiko/json-schm-wasm)


JSON schema validation with `WebAssembly`.

⁉️ 🔨 still cooking - any JSON containing `null` will yield INVALID. 

`->` Make sure your schemas do not specify `null` values and that you are fine with rejecting JSON containing `null`s.

## Usage

``` ts
import { isValid } from "https://denopkg.com/chiefbiiko/json-schm-wasm/mod.ts";

isValid("419", '{"type":"number"}') // true
```

## License

[MIT](./LICENSE)