import env from "@config/env.ts";
import { Status, getQuery } from "@deps";
import { ServiceException } from "@exceptions/serviceException.ts";
import { ResponseBody } from "@models/response.model.ts";
import { handleGithubCallback, signup, verifyEmailOtp, signin } from "@services/auth.service.ts";
import { OakContext } from "@types";
import catchHandler from "@utils/catchHandler.ts";
import { registerRequestSchema } from "@models/web/signup.model.ts";
import { verifyEmailOtpRequestSchema } from "@models/web/signup.model.ts";
import { loginRequestSchema } from "@models/web/signin.model.ts";
import parseBody from "@utils/parseBody.ts";

export function getGithubOAuthUrlHandler(ctx: OakContext<"/github/url">) {

    const baseUrl = new URL("https://github.com/login/oauth/authorize");

    baseUrl.searchParams.append("client_id", env.GITHUB_CLIENT_ID);
    baseUrl.searchParams.append("redirect_uri", env.GITHUB_REDIRECT_URI);
    baseUrl.searchParams.append("scope", "read:user");
    baseUrl.searchParams.append("state", env.JWT_PUBLIC_KEY);

    ctx.response.status = Status.OK;
    ctx.response = new ResponseBody()
        .setCode(Status.OK)
        .setStatus("OK")
        .setData({
            url: baseUrl.toString()
        })
        .toResponse(ctx.response);

}

export async function getGithubOAuthTokenHandler(ctx: OakContext<"/github/callback">) {

    const { code } = getQuery(ctx);

    if (typeof code !== "string") {
        ctx.response = new ServiceException()
            .setCode(Status.BadRequest)
            .setStatus("Bad Request")
            .setCommonError("Invalid Request!")
            .toResponse(ctx.response);
        return
    }

    try {

        const redirectUrl = await handleGithubCallback(code);
        ctx.response.redirect(redirectUrl);

    } catch (error) {
        catchHandler(ctx.response, error);
    }

}

export async function signupHandler(ctx: OakContext<"/signup">) {

    try {

        const reqBody = registerRequestSchema.parse(await parseBody(ctx.request));

        await signup(reqBody);

        ctx.response = new ResponseBody()
            .setCode(Status.OK)
            .setStatus("OK")
            .toResponse(ctx.response);

    } catch (error) {
        catchHandler(ctx.response, error);
    }

}

export async function verifyEmailOtpHandler(ctx: OakContext<"/signup/verify">) {

    try {

        const reqBody = verifyEmailOtpRequestSchema.parse(await parseBody(ctx.request));
        await verifyEmailOtp(reqBody);

        ctx.response = new ResponseBody()
            .setCode(Status.OK)
            .setStatus("OK")
            .toResponse(ctx.response);

    } catch (error) {
        catchHandler(ctx.response, error);
    }

}

export async function signinHandler(ctx: OakContext<"/">) {

    try {

        const reqBody = loginRequestSchema.parse(await parseBody(ctx.request));
        const { token, user } = await signin(reqBody);

        ctx.response = new ResponseBody()
            .setCode(Status.OK)
            .setStatus("OK")
            .setData(user)
            .setInfo({ token })
            .toResponse(ctx.response);

    } catch (error) {
        catchHandler(ctx.response, error);
    }

}

export function getMeHandler(ctx: OakContext<"/me">) {

    ctx.response = new ResponseBody()
        .setCode(Status.OK)
        .setStatus("OK")
        .setData(ctx.state.user)
        .toResponse(ctx.response);

}