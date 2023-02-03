export default function excludeFields<T>(obj: T, fields: string[]): T {

    if (Array.isArray(obj)) {
        return obj.map((x) => excludeFields(x, fields)) as unknown as T;
    }

    const newObj = { ...obj };

    for (const field of fields) {
        // @ts-ignore - TS doesn't know that newObj[field] exists
        delete newObj[field];
    }

    return newObj;
}