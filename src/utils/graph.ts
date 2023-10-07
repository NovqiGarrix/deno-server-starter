import { Status } from "@deps";
import env from "@config/env.ts";
import logger from "@utils/logger.ts";
import redisClient from "@utils/redisClient.ts";
import { ServiceException } from "../exeptions/serviceExeption.ts";

const REFRESH_TOKEN_REDIS_KEY = "movieku-video-api-graph-refresh_token";
// const ACCESS_TOKEN_PREFIX = "movieku-video-api-graph-access_token:";

interface TokenInterface {
    access_token: string;
    expires_in: number;
    refresh_token: string;
}

function getRedirectUri() {
    return `${env.BASE_URL}/api/v1/auth/callback`;
}

function getAuthUrl() {
    const reqUrl = new URL(
        "https://login.microsoftonline.com/common/oauth2/v2.0/authorize",
    );

    reqUrl.searchParams.set("response_type", "code");
    reqUrl.searchParams.set("client_id", env.MICROSOFT_CLIENT_ID);
    reqUrl.searchParams.set("scope", "files.readwrite offline_access");
    reqUrl.searchParams.set(
        "redirect_uri",
        getRedirectUri(),
    );

    return reqUrl.toString();
}

async function requestAccessToken(
    code: string,
): Promise<TokenInterface> {
    try {
        const reqUrl = new URL(
            "https://login.microsoftonline.com/common/oauth2/v2.0/token",
        );

        const reqBody = {
            code,
            grant_type: "authorization_code",
            client_id: env.MICROSOFT_CLIENT_ID,
            redirect_uri: getRedirectUri(),
            client_secret: env.MICROSOFT_CLIENT_SECRET,
        };

        const queryParams = new URLSearchParams(reqBody).toString();

        const resp = await fetch(reqUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: queryParams,
        });

        const respBody = await resp.json();

        if (!resp.ok) {
            console.log(respBody);
            throw new Error("-");
        }

        const { refresh_token } = respBody;

        await redisClient.set(
            REFRESH_TOKEN_REDIS_KEY,
            refresh_token,
        );

        return respBody;
    } catch (_error) {
        console.error(`requestAccessToken`, _error);
        throw new ServiceException({
            code: Status.InternalServerError,
            status: "Internal Server Error",
            errors: [{
                error: "Internal Server Error",
            }],
        });
    }
}

async function getAccessToken(): Promise<string> {
    try {
        const refreshTokenFromRedis =
            (await redisClient.get(REFRESH_TOKEN_REDIS_KEY))?.toString();
        if (!refreshTokenFromRedis) {
            logger.error(`Refresh Token did not set in Redis yet! :(`);
            throw new Error("-");
        }

        const reqUrl = new URL(
            "https://login.microsoftonline.com/common/oauth2/v2.0/token",
        );

        const reqBody = {
            grant_type: "refresh_token",
            client_id: env.MICROSOFT_CLIENT_ID,
            redirect_uri: getRedirectUri(),
            refresh_token: refreshTokenFromRedis,
            client_secret: env.MICROSOFT_CLIENT_SECRET,
        };

        const queryParams = new URLSearchParams(reqBody).toString();

        const resp = await fetch(reqUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: queryParams,
        });

        const respBody = await resp.json();

        if (!resp.ok) {
            console.log(respBody);
            throw new Error("-");
        }

        const { access_token } = respBody;

        return access_token;
    } catch (error) {
        console.error("getAccessToken", error);
        throw new ServiceException({
            code: Status.InternalServerError,
            status: "Internal Server Error",
            errors: [{
                error: "Internal Server Error",
            }],
        });
    }
}

export default {
    getAuthUrl,
    getAccessToken,
    requestAccessToken,
};
