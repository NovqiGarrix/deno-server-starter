// deno-lint-ignore-file no-explicit-any
import { Status, OakResponse } from "@deps";
import type { FormError } from "@types";

interface ErrorField {
    field?: string;
    message?: string;
    error?: string;
    source?: any;
}

export class ServiceException extends Error {

    #code = Status.InternalServerError;
    #status = "InternalServerError";
    errors: Array<ErrorField> = [];
    cause?: unknown;

    constructor() {
        super("ServiceException");
    }

    setCode(code: number): ServiceException {
        this.#code = code;
        return this
    }

    setStatus(status: string): ServiceException {
        this.#status = status;
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
        return new ServiceException().setErrors([{ error: "Something went wrong" }]);
    }

    toResponse(response: OakResponse): OakResponse {
        response.status = this.#code;

        const errorWithoutUndefined = this.errors.map((error) => {
            const newError: ErrorField = {};
            if (error.field) newError.field = error.field;
            if (error.message) newError.message = error.message;
            if (error.error) newError.error = error.error;
            return newError;
        });

        response.body = {
            code: this.#code,
            status: this.#status,
            errors: errorWithoutUndefined
        }

        return response;
    }

    private setErrors(errors: Array<ErrorField>): ServiceException {
        this.errors = errors;
        return this;
    }

    public static async fromHttpResponse(response: Response) {

        const { error, errors } = await response.json();

        return new ServiceException()
            .setCode(response.status)
            .setStatus(response.statusText)
            .setErrors([
                {
                    error: error?.message || errors?.[0]?.message || "Something went wrong",
                    source: {
                        headers: Object.fromEntries(response.headers.entries()),
                        url: response.url
                    }
                }
            ])

    }

    stringify() {
        return JSON.stringify({
            code: this.#code,
            status: this.#status,
            errors: this.errors
        });
    }

}