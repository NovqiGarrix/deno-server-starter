import "@dotenv";

import { assertEquals } from "@testDeps";
import db from "@utils/db.ts";

Deno.test("#1. Should be using local mongodb URL", () => {
  const DATABASE_URL = db.getConnectionURL();
  assertEquals(DATABASE_URL, "mongodb://localhost:27017/movieku");
});

Deno.test("#2. Should be using database url from param", () => {
  const DATABASE_URL = db.getConnectionURL("mongodb://localhost:27017");
  assertEquals(DATABASE_URL, "mongodb://localhost:27017");
});

Deno.test("#3. Should be using database url from .env with env from param", () => {
  Deno.env.set("DATABASE_URL", "mongodb://localhost:27017/production");

  const DATABASE_URL = db.getConnectionURL(undefined, "prod");
  assertEquals(DATABASE_URL, "mongodb://localhost:27017/production");
});

Deno.test("#4. Should be using database url from .env with env value from .env", () => {
  Deno.env.set("DENO_ENV", "production");
  Deno.env.set("DATABASE_URL", "mongodb://localhost:27017/production");

  const DATABASE_URL = db.getConnectionURL();
  assertEquals(DATABASE_URL, "mongodb://localhost:27017/production");
});