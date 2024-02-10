import { Context, jose, Status } from "@deps";
import { ServiceException } from "@exceptions/serviceException.ts";
import { JwtPayload } from "@types";
import catchHandler from "@utils/catchHandler.ts";
import jwt from "@utils/jwt.ts";

export default async function authMiddleware(
    // deno-lint-ignore no-explicit-any
    ctx: Context<Record<string, any>, Record<string, any>>,
    next: () => Promise<unknown>,
) {
    const token = ctx.request.headers
        .get("Authorization")
        ?.split("Bearer ").at(
            -1,
        );

    try {
        if (!token) {
            throw new ServiceException()
                .setCode(Status.Unauthorized)
                .setStatus("Unauthorized")
                .setCommonError("Unauthorized");
        }

        let payload: (jose.JWTPayload & JwtPayload) | undefined = undefined;

        try {
            payload = await jwt.verify(token);
        } catch (_error) {
            throw new ServiceException()
                .setCode(Status.Unauthorized)
                .setStatus("Unauthorized")
                .setCommonError("Unauthorized");
        }

        ctx.state.user = payload;

        await next();
    } catch (error) {
        catchHandler(ctx.response, error);
    }
}
