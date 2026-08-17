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
  active BOOLEAN DEFAULT TRUE,
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

CREATE TABLE IF NOT EXISTS orders (
  id BIGSERIAL PRIMARY KEY,
  email TEXT NOT NULL,
  customer_name TEXT,
  items JSONB DEFAULT '[]'::jsonb,
  total NUMERIC(10, 2) DEFAULT 0,
  payment_method TEXT,
  status TEXT DEFAULT 'pending',
  refund_requested BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS orders_email_idx ON orders (email);
CREATE INDEX IF NOT EXISTS orders_status_idx ON orders (status);
