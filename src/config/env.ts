import "@dotenv";
import { z } from "@deps";

const envSchema = z.object({
    PORT: z.string().default("4000"),
    DENO_ENV: z.string().default("development"),
    CLIENT_URL: z.string().default("http://localhost:3000"),
    JWT_PUBLIC_KEY: z.string(),
    JWT_PRIVATE_KEY: z.string()
});

export default envSchema.parse(Deno.env.toObject());
