import { test, runIfMain } from "https://deno.land/std/testing/mod.ts";
import { assert, assertEquals } from "https://deno.land/std/testing/asserts.ts";
import { isValid } from "./../mod.ts";

const encoder: TextEncoder = new TextEncoder();
const decoder: TextDecoder = new TextDecoder();

interface TestVector {
  description: string;
  schema: { [key: string]: any };
  tests: { description: string; data: any; valid: boolean }[];
}

const testVectors: TestVector[] = Deno.readDirSync("./draft7")
  .filter((info: Deno.FileInfo): boolean => info.name.endsWith(".json"))
  .map(
    (info: Deno.FileInfo): Uint8Array =>
      Deno.readFileSync(`./draft7/${info.name}`)
  )
  .map((file: Uint8Array): string => decoder.decode(file))
  .reduce((acc: any[], cur: string): any[] => acc.concat(JSON.parse(cur)), []);

testVectors.forEach(
  ({ description, schema, tests }: TestVector): void => {
    tests.forEach(
      ({ description: _description, data, valid }): void => {
        test({
          name: `${description} > ${_description}`,
          fn(): void {
            assertEquals(isValid(data, schema, false), valid);
          }
        });
      }
    );
  }
);

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
    assert(
      isValid(
        '{"fraud":null}',
        '{"type":"object","properties":{"fraud":{"type":"null"}}}'
      )
    );
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

test({
  name: "accepts pojos",
  fn() {
    assert(
      isValid(
        { fraud: "money" },
        { type: "object", properties: { fraud: { type: "string" } } }
      )
    );
  }
});

test({
  name: "works with things like arrays",
  fn() {
    assert(isValid([4, 1, 9], { type: "array", items: { type: "number" } }));
  }
});

runIfMain(import.meta, {
  parallel: true,
  // only: RegExp(
  //   "(?:minItems validation > ignores non-arrays)|" +
  //     "(?:additionalProperties being false does not allow other properties > ignores strings)" +
  //     "(?:exclusiveMinimum validation > ignores non-numbers)|" +
  //     "(?:anyOf with base schema > one anyOf valid)|" +
  //     "(?:anyOf with boolean schemas, all true > any value is valid)|" +
  //     "(?:anyOf with boolean schemas, some true > any value is valid)|" +
  //     "(?:anyOf with one empty schema > string is valid)|" +
  //     "(?:propertyNames validation > ignores strings)|" +
  //     "(?:boolean schema 'true' > string is valid)|" +
  //     "(?:not > allowed)|" +
  //     "(?:not multiple types > valid)|" +
  //     "(?:not with boolean schema false > any value is valid)|" +
  //     "(?:enum with escaped characters > member 1 is valid)|" +
  //     "(?:enum with escaped characters > member 2 is valid)|" +
  //     "(?:minProperties validation > ignores strings)|" +
  //     "(?:maxLength validation > shorter is valid)|" +
  //     "(?:maxLength validation > exact length is valid)|" +
  //     "(?:maxLength validation > two supplementary Unicode code points is long enough)|" +
  //     "(?:exclusiveMaximum validation > ignores non-numbers)|" +
  //     "(?:minimum validation > ignores non-numbers)|" +
  //     "(?:minimum validation with signed integer > ignores non-numbers)|" +
  //     "(?:oneOf with base schema > one oneOf valid)|" +
  //     "(?:oneOf with boolean schemas, one true > any value is valid)|" +
  //     "(?:oneOf with empty schema > one valid - valid)|" +
  //     "(?:ignore if without then or else > valid when invalid against lone if)|" +
  //     "(?:ignore then without if > valid when invalid against lone then)|" +
  //     "(?:ignore else without if > valid when invalid against lone else)|" +
  //     "(?:pattern validation > a matching pattern is valid)|" +
  //     "(?:pattern is not anchored > matches a substring)|" +
  //     "(?:maxProperties validation > ignores strings)|" +
  //     "(?:required validation > ignores strings)|" +
  //     "(?:integer type matches integers > a string is still not an integer, even if it looks like one)|" +
  //     "(?:number type matches numbers > a string is still not a number, even if it looks like one)|" +
  //     "(?:string type matches strings > a string is a string)|" +
  //     "(?:string type matches strings > a string is still a string, even if it looks like a number)|" +
  //     "(?:string type matches strings > an empty string is still a string)|" +
  //     "(?:multiple types can be specified in an array > a string is valid)|" +
  //     "(?:type as array with one item > string is valid)|" +
  //     "(?:by int > ignores non-numbers)|" +
  //     "(?:patternProperties validates properties matching a regex > ignores strings)|" +
  //     "(?:remote ref > remote ref valid)|" +
  //     "(?:fragment within remote ref > remote fragment valid)|" +
  //     "(?:ref within remote ref > ref within ref valid)|" +
  //     "(?:base URI change > base URI change ref valid)|" +
  //     "(?:base URI change - change folder > number is valid)|" +
  //     "(?:base URI change - change folder in subschema > number is valid)|" +
  //     "(?:root ref in remote ref > string is valid)|" +
  //     "(?:root ref in remote ref > null is valid)|" +
  //     "(?:allOf with boolean schemas, all true > any value is valid)|" +
  //     "(?:ref to boolean schema true > any value is valid)|" +
  //     "(?:Location-independent identifier > match)|" +
  //     "(?:Location-independent identifier with absolute URI > match)|" +
  //     "(?:Location-independent identifier with base URI change in subschema > match)|" +
  //     "(?:maximum validation > ignores non-numbers)|" +
  //     "(?:minLength validation > longer is valid)|" +
  //     "(?:minLength validation > exact length is valid)|" +
  //     "(?:maxItems validation > ignores non-arrays)|" +
  //     "(?:contains keyword with boolean schema false > non-arrays are valid)|" +
  //     "(?:additionalProperties being false does not allow other properties > ignores strings)|" +
  //     "(?:dependencies > ignores strings)|" +
  //     "(?:exclusiveMinimum validation > ignores non-numbers)|" +
  //     "(?:contains keyword with boolean schema false > non-arrays are valid)"
  // )
});
