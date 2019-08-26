import { test, runIfMain } from "https://deno.land/std/testing/mod.ts";
import { assert } from "https://deno.land/std/testing/asserts.ts";
import { isValid } from "./mod.ts";

const encoder: TextEncoder = new TextEncoder();

test({
  name: "hello fraud",
  fn() {
    assert(isValid("419", '{"type":"number"}'));
  }
});

test({
  name: "null as schema is an error",
  fn() {
    assert(!isValid("419", "null"));
  }
});

test({
  name: "correctly handles null as instance",
  fn() {
    assert(isValid("null", "{}"));
  }
});

test({
  name: "correctly handles null as instance property",
  fn() {
    assert(isValid('{"fraud":null}', '{"type":"object","properties":{"fraud":{"type":"null"}}}'));
  }
});

test({
  name: "validating json buffers",
  fn() {
    assert(
      isValid(
        encoder.encode('{"fraud":419}'),
        encoder.encode(
          '{"type":"object","properties":{"fraud":{"type":"number"}}}'
        )
      )
    );
  }
});

test({
  name: "encoding strings is slow",
  fn() {
    assert(
      isValid(
        '{"fraud":419}',
        '{"type":"object","properties":{"fraud":{"type":"number"}}}'
      )
    );
  }
});

test({
  name: "validating the input schema slows things down too",
  fn() {
    assert(
      isValid(
        '{"fraud":419}',
        '{"type":"object","properties":{"fraud":{"type":"number"}}}',
        true
      )
    );
  }
});

test({
  name: "detects schema syntax errors if validateSchema is true",
  fn() {
    assert(
      !isValid(
        '{"fraud":419}',
        '{"type":"object","properties":{"fraud":{"type":"numbr"}}}',
        true
      )
    );
  }
});

test({
  name: "does not detect schema syntax errors if validateSchema is false",
  fn() {
    assert(
      isValid(
        '{"fraud":419}',
        '{"type":"object","properties":{"fraud":{"type":"numbr"}}}',
        false
      )
    );
  }
});

test({
  name: "validateSchema defaults to true",
  fn() {
    assert(
      !isValid(
        '{"fraud":419}',
        '{"type":"object","properties":{"fraud":{"type":"numbr"}}}'
      )
    );
  }
});

test({
  name: "gracefully handles invalid json",
  fn() {
    assert(!isValid("//", "{}"));
  }
});

runIfMain(import.meta, { parallel: true });
