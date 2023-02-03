import "@dotenv";
import { novo } from "@deps";
import logger from "@utils/logger.ts";

function getConnectionURL(
    connectionString?: string,
    env = Deno.env.get("DENO_ENV") || "dev",
) {
    if (connectionString?.length) {
        logger.info("Using connection string from param")
        return connectionString
    } else if (env === "dev") {
        logger.info("Using development connection string")
        return "mongodb://127.0.0.1:27017/movieku";
    } else {
        logger.info("Using connection string from env variables");
        return Deno.env.get("DATABASE_URL");
    }
}

async function connect(
    connectionString?: string,
    env = Deno.env.get("DENO_ENV") || "dev",
) {
    const DATABASE_URL = getConnectionURL(connectionString, env);
    if (!DATABASE_URL) throw new Error("😡 No Database URL found! 😡");

    await novo.connect(DATABASE_URL);
}

function disconnect() {
    novo.disconnect();
}

export default {
    connect,
    disconnect,
    getConnectionURL,
};
