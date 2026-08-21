import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "../server/db/schema";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pg;

// Singleton connection pool for Next.js / Node.js
const globalForDb = globalThis as unknown as {
  pool: pg.Pool | undefined;
};

const connectionString = process.env.DATABASE_URL || "postgres://postgres:postgres@localhost:5432/vyroh_hub";

export const pool =
  globalForDb.pool ??
  new Pool({
    connectionString,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
    ssl: process.env.NODE_ENV === "production" && !connectionString.includes("localhost") ? { rejectUnauthorized: false } : undefined,
  });

if (process.env.NODE_ENV !== "production") {
  globalForDb.pool = pool;
}

export const db = drizzle(pool, { schema });
export { schema };
