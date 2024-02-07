import { OakResponse } from "@deps";
import { ServiceException } from "@exceptions/serviceException.ts";

export default function catchHandler(response: OakResponse, error: unknown) {
    if (error instanceof ServiceException) {
        response = error.toResponse(response);
        return
    }

    response = ServiceException.internalServerError().toResponse(response);
}
