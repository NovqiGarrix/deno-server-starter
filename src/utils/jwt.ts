// deno-lint-ignore-file no-explicit-any
import { jose } from "@deps";
import { decodeBase64 } from "@deps";
import env from "@config/env.ts";

const alg = "RS256";

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
        .setIssuer("novqi:srsku:movieku-video-api:issuer")
        .setAudience("novqi:srsku:movieku-client")
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
            payload.iss !== "novqi:srsku:movieku-video-api:issuer" &&
            payload.aud !== "novqi:srsku:movieku-client"
        ) throw new Error("Unauthorized Client");

        return payload as jose.JWTPayload & T;
    } catch (_error) {
        throw new Error("Invalid token");
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
