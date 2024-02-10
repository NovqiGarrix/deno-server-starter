import { assert } from '@testDeps';
import isBase64 from './isBase64.ts';

Deno.test('isBase64', () => {
    const base64Image = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAZCAYAAADE6YVjAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw";
    assert(isBase64(base64Image));
});