import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "./schema";

const { Pool } = pg;

let pool: pg.Pool | null = null;
let dbInstance: ReturnType<typeof drizzle<typeof schema>> | null = null;

/**
 * Returns Drizzle Database client instance connected to PostgreSQL if DATABASE_URL is set.
 * Returns null if DATABASE_URL is not configured, allowing smooth mock fallback.
 */
export function getDb() {
  if (dbInstance) {
    return dbInstance;
  }

  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    return null;
  }

  try {
    pool = new Pool({
      connectionString: databaseUrl,
      ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
      max: 10,
      idleTimeoutMillis: 30000,
    });

    dbInstance = drizzle(pool, { schema });
    return dbInstance;
  } catch (error) {
    console.warn("[Vyroh DB] Warning: Failed to connect to DATABASE_URL. Running in resilient mock fallback mode.", error);
    return null;
  }
}

export function isDbConnected(): boolean {
  return Boolean(process.env.DATABASE_URL && dbInstance !== null);
}

export { schema };
