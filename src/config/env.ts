import "@dotenv";
import { z } from "@deps";

const envSchema = z.object({
    PORT: z.string().default("4000"),
    DENO_ENV: z.string().default("development"),
    BASE_URL: z.string().default("http://localhost:4000"),
    CLIENT_URL: z.string().default("http://localhost:3000"),
    REDIS_HOSTNAME: z.string(),
    REDIS_PORT: z.string(),
    REDIS_PASSWORD: z.string(),
    MICROSOFT_CLIENT_ID: z.string(),
    MICROSOFT_CLIENT_SECRET: z.string(),
    JWT_PUBLIC_KEY: z.string(),
    JWT_PRIVATE_KEY: z.string(),
});

export default envSchema.parse(Deno.env.toObject());
