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
