import { OakResponse, Status } from "@deps";
import { ServiceException } from "../exeptions/serviceExeption.ts";

export default function catchHandler(response: OakResponse, error: unknown) {
    if (error instanceof ServiceException) {
        response.status = error.code;
        response.body = {
            code: error.code,
            status: error.status,
            errors: error.errors,
        };
        return;
    }

    response.status = Status.InternalServerError;
    response.body = {
        code: 500,
        status: "InternalServerError",
        errors: [{
            error: "InternalServerError",
        }],
    };
}
