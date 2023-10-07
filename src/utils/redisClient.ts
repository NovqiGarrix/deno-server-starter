import "@dotenv";
import { connectRedis, Redis } from "@deps";

class RedisClient {
  public static redisClient: Redis;

  public static async getClient(): Promise<Redis> {
    if (this.redisClient) return this.redisClient;

    const REDIS_HOSTNAME = Deno.env.get("REDIS_HOSTNAME")!;
    const REDIS_PORT = +Deno.env.get("REDIS_PORT")!;
    const REDIS_PASSWORD = Deno.env.get("REDIS_PASSWORD");

    this.redisClient = await connectRedis({
      hostname: REDIS_HOSTNAME,
      port: REDIS_PORT,
      password: REDIS_PASSWORD,
      tls: true,
    });

    return this.redisClient;
  }
}

const redisClient = await RedisClient.getClient();
export default redisClient;