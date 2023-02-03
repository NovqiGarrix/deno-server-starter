import { assertObjectMatch, assertArrayIncludes } from '@testDeps';
import excludeFields from './excludeFields.ts';

Deno.test("Exclude Fields in Object", () => {

    const obj = {
        a: 1,
        b: 2,
        c: 3,
    };

    const fields = ["a", "c"];

    const expected = {
        b: 2,
    };

    assertObjectMatch(excludeFields(obj, fields), expected);

});

Deno.test("Exclude Fields in Array", () => {

    const obj = [
        {
            a: 1,
            b: 2,
            c: 3,
        },
        {
            a: 4,
            b: 5,
            c: 6,
        },
    ];

    const fields = ["a", "c"];

    const expected = [
        {
            b: 2,
        },
        {
            b: 5,
        },
    ];

    assertArrayIncludes(excludeFields(obj, fields), expected);

});