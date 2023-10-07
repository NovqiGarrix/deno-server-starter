import type { OakContext } from "@types";
import { getQuery, Status } from "@deps";

import graph from "@utils/graph.ts";
import catchHandler from "@utils/catchHandler.ts";

export function getAuthUrlHandler(ctx: OakContext<"/url">) {
    ctx.response.status = Status.OK;
    ctx.response.body = {
        code: ctx.response.status,
        status: "OK",
        body: graph.getAuthUrl(),
    };
}

export async function authCallbackHandler(ctx: OakContext<"/callback">) {
    try {
        const queryParams = getQuery(ctx);

        const code = queryParams.code;
        if (!code || typeof code !== "string") {
            ctx.response.status = Status.BadRequest;
            ctx.response.body = {
                code: ctx.response.status,
                status: "BadRequest",
                errors: [
                    {
                        error: "Invalid Code from QueryParams",
                    },
                ],
            };
            return;
        }

        await graph.requestAccessToken(code);

        ctx.response.status = Status.OK;
    } catch (error) {
        catchHandler(ctx.response, error);
    }
}

export async function getAccessTokenHandler(ctx: OakContext<"/act">) {
    try {
        const act = await graph.getAccessToken();

        ctx.response.status = Status.OK;
        ctx.response.body = {
            code: ctx.response.status,
            status: "OK",
            data: act,
        };
    } catch (error) {
        catchHandler(ctx.response, error);
    }
}
