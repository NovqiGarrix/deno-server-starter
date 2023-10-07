import "@dotenv";
import "@utils/jwt.ts";

import createServer from "@app";

import logger from "@utils/logger.ts";
import env from "@config/env.ts";

const abortController = new AbortController();

const app = createServer();

const signals = ["SIGINT", "SIGTERM"];
for (let systemSignal of signals) {
    if (Deno.build.os === "windows" && systemSignal === "SIGTERM") {
        systemSignal = "SIGBREAK";
    }

    Deno.addSignalListener(systemSignal as Deno.Signal, () => {
        logger.warning(`Received ${systemSignal}, exiting...`.toUpperCase());
    });
}

globalThis.addEventListener("unload", () => {
    abortController.abort();
});

app.addEventListener("listen", ({ hostname, port, serverType }) => {
    logger.info(
        `Listening on ${hostname}:${port} with ${serverType} SERVER`
            .toUpperCase(),
    );
});

await app.listen({ port: +env.PORT, signal: abortController.signal });
