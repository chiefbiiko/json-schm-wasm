use jsonschema_valid::{is_valid, schemas::Draft7};
use serde_json::{from_slice, from_str, Value};
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn is_valid_str(instance: &str, schema: &str, validate_schema: i32) -> i32 {
    let inst: Value = match from_str::<Value>(instance) {
        Ok(inst) => inst,
        _ => return 0,
    };

    let schm: Value = match from_str::<Value>(schema) {
        Ok(schm) => schm,
        _ => return 0,
    };

    is_valid(&inst, &schm, Some(&Draft7), validate_schema == 1) as i32
}

#[wasm_bindgen]
pub fn is_valid_buf(instance: &[u8], schema: &[u8], validate_schema: i32) -> i32 {
    let inst: Value = match from_slice::<Value>(instance) {
        Ok(inst) => inst,
        _ => return 0,
    };

    let schm: Value = match from_slice::<Value>(schema) {
        Ok(schm) => schm,
        _ => return 0,
    };

    is_valid(&inst, &schm, Some(&Draft7), validate_schema == 1) as i32
}
