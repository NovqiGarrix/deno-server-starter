import { Status, getQuery } from "@deps";
import { OakContext } from "@types";

export const hello = (ctx: OakContext<"/">) => {

    const { response: res } = ctx;
    const queryParams = getQuery(ctx);

    res.status = Status.OK;
    res.body = {
        code: Status.OK,
        status: "OK",
        data: `Hello, ${queryParams.name || 'World'}!`
    }
}