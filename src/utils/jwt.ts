// deno-lint-ignore-file no-explicit-any
import { Status, jose } from "@deps";
import env from "@config/env.ts";
import { decodeBase64 } from "@deps";
import { ServiceException } from "@exceptions/serviceException.ts";

const alg = "RS256";

const ISSUER = "novqi:mentortemanhidup:issuer";
const AUDIENCE = "mentortemanhidupapp";

const textDecoder = new TextDecoder("utf-8");
const PUBLIC_KEY = await jose.importSPKI(
    textDecoder.decode(decodeBase64(env.JWT_PUBLIC_KEY)),
    alg,
);
const PRIVATE_KEY = await jose.importPKCS8(
    textDecoder.decode(decodeBase64(env.JWT_PRIVATE_KEY)),
    alg,
);

async function signJwt(payload: any, expired: string) {
    const jwt = await new jose.SignJWT(payload)
        .setProtectedHeader({ alg })
        .setIssuedAt()
        .setIssuer(ISSUER)
        .setAudience(AUDIENCE)
        .setExpirationTime(expired)
        .sign(PRIVATE_KEY);

    return jwt;
}

async function verify<T>(token: string): Promise<jose.JWTPayload & T> {
    try {
        const { payload } = await jose.jwtVerify(token, PUBLIC_KEY, {
            algorithms: [alg],
        });

        if (
            payload.iss !== ISSUER &&
            payload.aud !== AUDIENCE
        ) throw new ServiceException()
            .setCode(Status.Unauthorized)
            .setStatus("Unauthorized")
            .setCommonError("Invalid token");

        return payload as jose.JWTPayload & T;
    } catch (error) {
        if (error instanceof ServiceException) throw error;

        throw new ServiceException()
            .setCode(Status.Unauthorized)
            .setStatus("Unauthorized")
            .setCommonError("Invalid or expired token");
    }
}

function decode(token: string): any {
    try {
        return jose.decodeJwt(token);
    } catch (_error) {
        throw new Error("Invalid token");
    }
}

export default {
    signJwt,
    verify,
    decode,
};
