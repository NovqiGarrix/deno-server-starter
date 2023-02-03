// deno-lint-ignore-file no-explicit-any
import { assertObject } from '@testDeps';

export default function assertObjectMatch(actual: any, expected: any) {
    // @ts-ignore - assertObjectMatch is supposed to have any type for actual and expected
    assertObject(actual, expected);
}