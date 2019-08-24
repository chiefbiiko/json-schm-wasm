# json-schm-wasm

`WASM_INTERFACE_TYPES=1 wasm-pack build`

`wasmtime ./pkg/json_schm_wasm.wasm --invoke is_valid_str 'null' '{"type":"number"}' \1`

`wasmtime ./pkg/json_schm_wasm.wasm --invoke is_valid_str '{"fraud":419}' '{"type":"object","properties":{"fraud":{"type":"number"}}}' \1`
