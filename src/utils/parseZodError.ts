import { z } from "@deps";

export interface ParsedZodError {
    field: string;
    message: string;
}

export function parseZodErrors(error: z.ZodError): Array<ParsedZodError> {
    return error.errors.map((err) => {
        const field = err.path.join('.');
        return {
            field,
            message: err.message,
        };
    });
}