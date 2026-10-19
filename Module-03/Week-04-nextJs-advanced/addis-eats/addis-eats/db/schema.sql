CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE TABLE IF NOT EXISTS users (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 name text NOT NULL CHECK (char_length(name) BETWEEN 2 AND 80),
 email text NOT NULL UNIQUE,
 phone text NOT NULL UNIQUE,
 password_hash text NOT NULL,
 role text NOT NULL DEFAULT 'customer' CHECK (role IN ('customer','staff')),
 created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS dishes (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), slug text NOT NULL UNIQUE,
 name text NOT NULL, description text NOT NULL DEFAULT '',
 price_cents integer NOT NULL CHECK (price_cents >= 0),
 image_url text, available boolean NOT NULL DEFAULT true,
 created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS orders (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 user_id uuid NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
 status text NOT NULL DEFAULT 'placed' CHECK (status IN ('placed','preparing','ready','completed','cancelled')),
 total_cents integer NOT NULL CHECK (total_cents >= 0),
 created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS order_items (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
 dish_id uuid NOT NULL REFERENCES dishes(id) ON DELETE RESTRICT,
 quantity integer NOT NULL CHECK (quantity BETWEEN 1 AND 20),
 unit_price_cents integer NOT NULL CHECK (unit_price_cents >= 0)
);
CREATE INDEX IF NOT EXISTS orders_user_created_idx ON orders(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS order_items_order_idx ON order_items(order_id);
CREATE INDEX IF NOT EXISTS dishes_available_idx ON dishes(available, name);
