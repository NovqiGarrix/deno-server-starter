import { z } from "@deps";

export const requiredString = (msg: string) => z.string({ required_error: msg }).min(1, { message: msg });
