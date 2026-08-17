import "server-only";
import pg from "pg";

const { Pool } = pg;

const globalForPostgres = globalThis;

const createPool = () => {
  if (!process.env.NEXT_PUBLIC_DATABASE_URL) {
    throw new Error("Missing NEXT_PUBLIC_DATABASE_URL environment variable");
  }

  const shouldUseSsl =
    process.env.NODE_ENV === "production" ||
    process.env.PGSSL === "true" ||
    process.env.NEXT_PUBLIC_DATABASE_URL.includes("sslmode=require");

  return new Pool({
    connectionString: process.env.NEXT_PUBLIC_DATABASE_URL,
    ssl: shouldUseSsl ? { rejectUnauthorized: false } : undefined,
  });
};

const DbConnect = () => {
  if (!globalForPostgres.postgresPool) {
    globalForPostgres.postgresPool = createPool();
  }

  return globalForPostgres.postgresPool;
};

export default DbConnect;
