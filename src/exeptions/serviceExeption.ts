interface ErrorField {
    field?: string;
    message?: string;
    error?: string;
}

interface IServiceExeptionContructorParams {
    code: number;
    status: string;
    errors: Array<ErrorField>;
}

export class ServiceException extends Error {

    public code: number;
    public status: string;
    public errors: Array<ErrorField>;
    public cause?: unknown;

    constructor(params: IServiceExeptionContructorParams) {
        super("ServiceException", { cause: params.code });

        this.code = params.code;
        this.status = params.status;
        this.errors = params.errors;
    }

}