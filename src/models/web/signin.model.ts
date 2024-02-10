import { z } from "@deps";
import { requiredString } from "@models/zod.ts";

export const loginRequestSchema = z.object({
    email: requiredString("Email tidak boleh kosong").email({ message: "Email Anda tidak valid" }),
    password: requiredString("Password tidak boleh kosong").min(6, "Password Anda minimal memiliki 6 karakter")
});

export type LoginRequestSchema = z.infer<typeof loginRequestSchema>;