import { test, runIfMain } from "https://deno.land/std/testing/mod.ts";
import { assert } from "https://deno.land/std/testing/asserts.ts";
import { loadWasm } from "./mod.ts";

const { is_valid_str, is_valid_buf } = loadWasm();

test({
  name: "fraud world",
  fn() {
    const isValid = is_valid_str(
      '{"fraud":419}',
      '{"type":"object","properties":{"fraud":{"type":"number"}}}',
      1
    );

    assert(Boolean(isValid));
  }
});

runIfMain(import.meta, { parallel: true });
