interface IServiceExeptionContructorParams {
    message: string;
    code: number;
    cause?: unknown;
}

export class ServiceException extends Error {

    public message: string;
    public code: number;
    public cause?: unknown;

    constructor(params: IServiceExeptionContructorParams) {
        super(params.message, { cause: params.cause });

        this.message = params.message;
        this.code = params.code;
    }

} 