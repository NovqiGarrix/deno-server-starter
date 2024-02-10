import { z } from "@deps";
import { requiredString } from "@models/zod.ts";
import isBase64 from "@utils/isBase64.ts";

export const uploadFileParamsSchema = z.object({
    base64: requiredString("This field is required").refine((base64) => isBase64(base64), { message: "Invalid base64 format" }),
    filepath: requiredString("This field is required"),
    contentType: requiredString("This field is required")
});

export type UploadFileParams = z.infer<typeof uploadFileParamsSchema>;