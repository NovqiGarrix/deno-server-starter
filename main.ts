import "@dotenv";
import "@utils/jwt.ts";

import createServer from "@app";

import logger from "@utils/logger.ts";
import env from "@config/env.ts";
import { novo } from "@deps";

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

await novo.connect(env.DATABASE_URL);

app.addEventListener("listen", ({ hostname, port, serverType }) => {
    logger.info(
        `Listening on ${hostname}:${port} with ${serverType} SERVER`
            .toUpperCase()
    );
});

globalThis.addEventListener('unhandledrejection', (e) => {
    if (e.reason.name === "AddrInUse") {
        const pId = new Deno.Command("lsof", {
            args: ["-t", "-i:4000"]
        }).outputSync();

        const processId = new TextDecoder().decode(pId.stdout).trimEnd();

        new Deno.Command("kill", {
            args: ["-9", processId]
        }).outputSync();
        Deno.exit(5)
    }
})

await app.listen({ port: +env.PORT, signal: abortController.signal });
