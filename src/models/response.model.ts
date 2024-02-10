// deno-lint-ignore-file no-explicit-any
import { OakResponse, Status } from "@deps";

export class ResponseBody {

    #data: any | undefined = undefined;
    #info: any | undefined = undefined;
    #status = "OK";
    #code = Status.OK;

    constructor() {
    }

    setStatus(string: string) {
        this.#status = string;
        return this;
    }

    setCode(code: number) {
        this.#code = code;
        return this;
    }

    setData(data: any) {
        this.#data = data;
        return this;
    }

    setInfo(info: any) {
        this.#info = info;
        return this;
    }

    toResponse(response: OakResponse) {
        response.status = this.#code;
        response.body = {
            code: this.#code,
            status: this.#status,
            ...(this.#data ? { data: this.#data } : {}),
            ...(this.#info ? { info: this.#info } : {})
        }

        return response
    }

}