// deno-lint-ignore-file no-explicit-any
import { Context, jose, Status } from "@deps";
import { ServiceException } from "../exeptions/serviceExeption.ts";
import jwt from "@utils/jwt.ts";

export default async function authMiddleware(
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
            throw new ServiceException({
                code: Status.Unauthorized,
                status: "Unauthorized",
                errors: [
                    {
                        error: "Unauthorized",
                    },
                ],
            });
        }

        let payload: jose.JWTPayload | undefined = undefined;

        try {
            payload = await jwt.verify(token);
        } catch (_error) {
            throw new ServiceException({
                code: Status.Unauthorized,
                status: "Unauthorized",
                errors: [
                    {
                        error: "Unauthorized",
                    },
                ],
            });
        }

        if (
            payload.iss !== "novqi:srsku:movieku-video-api:issuer" &&
            payload.aud !== "novqi:srsku:movieku-client"
        ) {
            throw new ServiceException({
                code: Status.Unauthorized,
                status: "Unauthorized",
                errors: [
                    {
                        error: "Unauthorized Client",
                    },
                ],
            });
        }

        await next();
    } catch (error) {
        if (error instanceof ServiceException) {
            ctx.response.status = error.code;
            ctx.response.body = {
                code: error.code,
                status: error.status,
                errors: error.errors,
            };
            return;
        }

        ctx.response.status = Status.InternalServerError;
        ctx.response.body = {
            code: 500,
            status: "InternalServerError",
            errors: [{
                error: "InternalServerError",
            }],
        };
    }
}
