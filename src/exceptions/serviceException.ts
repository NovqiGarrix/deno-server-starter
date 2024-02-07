import { Status, OakResponse } from "@deps";
import type { FormError } from "@types";

interface ErrorField {
    field?: string;
    message?: string;
    error?: string;
}

export class ServiceException extends Error {

    public code = Status.InternalServerError;
    public status = "InternalServerError";
    public errors: Array<ErrorField> = [{ error: "Something went wrong" }];
    public cause?: unknown;

    constructor() {
        super("ServiceException");
    }

    setCode(code: number): ServiceException {
        this.code = code;
        return this
    }

    setStatus(status: string): ServiceException {
        this.status = status;
        return this
    }

    setValidationErrors(validationErrors: Array<FormError>): ServiceException {

        for (const error of validationErrors) {
            this.errors.push({
                field: error.field,
                message: error.message
            });
        }

        return this
    }

    setCommonError(error: string): ServiceException {
        this.errors = [{ error }];
        return this
    }

    public static internalServerError(): ServiceException {
        return new ServiceException();
    }

    toResponse(response: OakResponse): OakResponse {
        response.status = this.code;

        const errorWithoutUndefined = this.errors.map((error) => {
            const newError: ErrorField = {};
            if (error.field) newError.field = error.field;
            if (error.message) newError.message = error.message;
            if (error.error) newError.error = error.error;
            return newError;
        });

        response.body = {
            code: this.code,
            status: this.status,
            errors: errorWithoutUndefined
        }

        return response;
    }

}