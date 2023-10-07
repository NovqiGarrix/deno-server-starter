import type { OakContext } from "@types";
import { getQuery, Status } from "@deps";

import graph from "@utils/graph.ts";
import catchHandler from "@utils/catchHandler.ts";

export const hello = (ctx: OakContext<"/">) => {
    const { response: res } = ctx;
    const queryParams = getQuery(ctx);

    res.status = Status.OK;
    res.body = {
        code: Status.OK,
        status: "OK",
        data: `Hello, ${queryParams.name || "World"}!`,
    };
};

export async function getAccessTokenHandler(ctx: OakContext<"/act">) {
    try {
        const accessToken = await graph.getAccessToken(ctx.request.ip);

        ctx.response.status = Status.OK;
        ctx.response.body = {
            code: Status.OK,
            status: "OK",
            data: accessToken,
        };
    } catch (error) {
        catchHandler(ctx.response, error);
    }
}
