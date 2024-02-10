import { z } from "@deps";
import isBase64 from "@utils/isBase64.ts";

export const uploadUserFormFileSchema = z.object({
    base64: z.string().refine((base64) => isBase64(base64), { message: "Invalid base64 format" }),
    contentType: z.string(),
});

export type UploadUserFormFileRequestSchema = z.infer<typeof uploadUserFormFileSchema>;