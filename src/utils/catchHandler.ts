import { OakResponse, z } from "@deps";
import { ServiceException } from "@exceptions/serviceException.ts";
import { parseZodErrors } from "@utils/parseZodError.ts";

export default function catchHandler(response: OakResponse, error: unknown) {
    if (error instanceof ServiceException) {
        response = error.toResponse(response);
        return
    } else if (error instanceof z.ZodError) {
        response = new ServiceException()
            .setCode(400)
            .setStatus("Bad Request")
            .setValidationErrors(parseZodErrors(error))
            .toResponse(response);
        return
    }

    response = ServiceException.internalServerError().toResponse(response);
}
