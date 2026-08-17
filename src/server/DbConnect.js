import "server-only";
import pg from "pg";

const { Pool } = pg;

const globalForPostgres = globalThis;

const schemaSql = `
  CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    image TEXT,
    price NUMERIC(10, 2) DEFAULT 0,
    category TEXT,
    description TEXT,
    quantity INTEGER DEFAULT 0,
    sells INTEGER DEFAULT 0,
    made_date TEXT,
    manufacture_authority TEXT,
    location TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
  );

  CREATE INDEX IF NOT EXISTS products_category_idx ON products (category);

  CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    name TEXT,
    email TEXT UNIQUE NOT NULL,
    image TEXT,
    user_id TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    cart_item JSONB DEFAULT '[]'::jsonb,
    payments JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
  );

  CREATE INDEX IF NOT EXISTS users_email_idx ON users (email);
`;

const getConnectionString = () => {
  const connectionString = process.env.NEXT_PUBLIC_DATABASE_URL;

  if (!connectionString) {
    throw new Error("Missing NEXT_PUBLIC_DATABASE_URL environment variable");
  }

  try {
    const url = new URL(connectionString);
    const sslMode = url.searchParams.get("sslmode");
    const sslModesWithUpcomingPgBehaviorChange = ["prefer", "require", "verify-ca"];

    if (
      sslModesWithUpcomingPgBehaviorChange.includes(sslMode) &&
      !url.searchParams.has("uselibpqcompat")
    ) {
      url.searchParams.set("uselibpqcompat", "true");
    }

    return url.toString();
  } catch {
    return connectionString;
  }
};

const initializeSchema = async (pool) => {
  if (!globalForPostgres.postgresSchemaReady) {
    globalForPostgres.postgresSchemaReady = pool.query(schemaSql);
  }

  await globalForPostgres.postgresSchemaReady;
};

const createPool = () => {
  const connectionString = getConnectionString();

  const shouldUseSsl =
    process.env.NODE_ENV === "production" ||
    process.env.PGSSL === "true" ||
    connectionString.includes("sslmode=require");

  return new Pool({
    connectionString,
    ssl: shouldUseSsl ? { rejectUnauthorized: false } : undefined,
  });
};

const DbConnect = async () => {
  if (!globalForPostgres.postgresPool) {
    globalForPostgres.postgresPool = createPool();
  }

  await initializeSchema(globalForPostgres.postgresPool);

  return globalForPostgres.postgresPool;
};

export default DbConnect;
