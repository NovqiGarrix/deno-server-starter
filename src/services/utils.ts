// deno-lint-ignore-file no-explicit-any
import { ServiceException } from "@exceptions/serviceException.ts";
import logger from "@utils/logger.ts";

export function handleError(error: any, cause?: string) {
    console.log(error);
    if (error instanceof ServiceException) {
        throw error;
    }

    logger.error(`Cause: ${cause || error?.cause}. Data: ${JSON.stringify(error, null, 2)}`);
    throw ServiceException.internalServerError().setCommonError("Something went wrong!");
}