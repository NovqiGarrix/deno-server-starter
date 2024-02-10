import "@dotenv";
import { z } from "@deps";

const envSchema = z.object({
    PORT: z.string().default("4000"),
    DENO_ENV: z.string().default("development"),
    CLIENT_URL: z.string().default("http://localhost:3000"),
    JWT_PUBLIC_KEY: z.string(),
    JWT_PRIVATE_KEY: z.string(),
    DATABASE_URL: z.string(),
    DATABASE_TEST_URL: z.string().optional(),
    GITHUB_CLIENT_ID: z.string(),
    GITHUB_CLIENT_SECRET: z.string(),
    SENDINBLUE_API_KEY: z.string(),
    ARGON2_SECRET: z.string(),
    GITHUB_REDIRECT_URI: z.string(),
    AWS_ACCESS_KEY: z.string(),
    AWS_SECRET_ACCESS_KEY: z.string(),
});

export default envSchema.parse(Deno.env.toObject());
