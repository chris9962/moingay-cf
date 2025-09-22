-- Create categories table
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create products table
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    image VARCHAR(1000),
    subtitle VARCHAR(255),
    description TEXT,
    price INTEGER NOT NULL,
    discount_price INTEGER,
    status VARCHAR(50) CHECK (status IN ('public', 'draft')) DEFAULT 'draft',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create product_categories junction table for many-to-many relationship
CREATE TABLE product_categories (
    product_id INTEGER REFERENCES products (id) ON DELETE CASCADE,
    category_id INTEGER REFERENCES categories (id) ON DELETE CASCADE,
    PRIMARY KEY (product_id, category_id)
);

-- Create orders table
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    order_id VARCHAR(255) UNIQUE NOT NULL,
    customer_name VARCHAR(255) NOT NULL,
    customer_phone1 VARCHAR(20) NOT NULL,
    customer_phone2 VARCHAR(20),
    customer_address TEXT NOT NULL,
    total_price INTEGER NOT NULL,
    status VARCHAR(50) CHECK (
        status IN (
            'pending',
            'paid',
            'delivered',
            'cancelled'
        )
    ) DEFAULT 'pending',
    payment_status VARCHAR(50) CHECK (
        payment_status IN ('unpaid', 'paid', 'refunded')
    ) DEFAULT 'unpaid',
    delivery_type VARCHAR(50) DEFAULT 'delivery',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    paid_at TIMESTAMP WITH TIME ZONE,
    delivered_at TIMESTAMP WITH TIME ZONE
);

-- Create order_items table for storing individual items in each order
CREATE TABLE order_items (
    id SERIAL PRIMARY KEY,
    order_id VARCHAR(255) REFERENCES orders (order_id) ON DELETE CASCADE,
    product_id INTEGER REFERENCES products (id) ON DELETE CASCADE,
    product_name VARCHAR(255) NOT NULL,
    product_price INTEGER NOT NULL,
    quantity INTEGER NOT NULL,
    item_note TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create function to update timestamp
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers to automatically update timestamps
CREATE TRIGGER update_products_modtime
BEFORE UPDATE ON products
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_categories_modtime
BEFORE UPDATE ON categories
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_orders_modtime
BEFORE UPDATE ON orders
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

-- Create RLS policies
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

ALTER TABLE product_categories ENABLE ROW LEVEL SECURITY;

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users (admin)
CREATE POLICY "Allow full access to authenticated users" ON products FOR ALL USING (
    auth.role () = 'authenticated'
);

CREATE POLICY "Allow full access to authenticated users" ON categories FOR ALL USING (
    auth.role () = 'authenticated'
);

CREATE POLICY "Allow full access to authenticated users" ON product_categories FOR ALL USING (
    auth.role () = 'authenticated'
);

CREATE POLICY "Allow full access to authenticated users" ON orders FOR ALL USING (
    auth.role () = 'authenticated'
);

CREATE POLICY "Allow full access to authenticated users" ON order_items FOR ALL USING (
    auth.role () = 'authenticated'
);

-- Create policies for anonymous users (read-only for public products)
CREATE POLICY "Allow anonymous users to read public products" ON products FOR
SELECT USING (status = 'public');

CREATE POLICY "Allow anonymous users to read categories" ON categories FOR
SELECT USING (true);

CREATE POLICY "Allow anonymous users to read product_categories" ON product_categories FOR
SELECT USING (
        EXISTS (
            SELECT 1
            FROM products p
            WHERE
                p.id = product_id
                AND p.status = 'public'
        )
    );

-- Create indexes for better performance
CREATE INDEX idx_products_status ON products (status);

CREATE INDEX idx_products_name ON products (name);

CREATE INDEX idx_products_price ON products (price);

CREATE INDEX idx_product_categories_product_id ON product_categories (product_id);

CREATE INDEX idx_product_categories_category_id ON product_categories (category_id);

-- Create indexes for orders table
CREATE INDEX idx_orders_order_id ON orders (order_id);

CREATE INDEX idx_orders_status ON orders (status);

CREATE INDEX idx_orders_payment_status ON orders (payment_status);

CREATE INDEX idx_orders_created_at ON orders (created_at);

CREATE INDEX idx_orders_customer_phone1 ON orders (customer_phone1);

-- Create indexes for order_items table
CREATE INDEX idx_order_items_order_id ON order_items (order_id);

CREATE INDEX idx_order_items_product_id ON order_items (product_id);

-- Create function to get random products by categories
CREATE OR REPLACE FUNCTION get_random_products_by_categories(category_ids integer[])
RETURNS TABLE (
  id integer,
  name varchar,
  image varchar,
  subtitle varchar,
  description text,
  price integer,
  discount_price integer,
  status varchar,
  created_at timestamptz,
  updated_at timestamptz,
  categories jsonb
) AS $$
BEGIN
  RETURN QUERY
  WITH random_products AS (
    SELECT DISTINCT ON (pc.category_id)
      p.*,
      pc.category_id
    FROM products p
    INNER JOIN product_categories pc ON p.id = pc.product_id
    WHERE pc.category_id = ANY(category_ids)
      AND p.status = 'public'
      AND p.image IS NOT NULL
    ORDER BY pc.category_id, random()
  )
  SELECT 
    rp.id,
    rp.name,
    rp.image,
    rp.subtitle,
    rp.description,
    rp.price,
    rp.discount_price,
    rp.status,
    rp.created_at,
    rp.updated_at,
    COALESCE(
      (
        SELECT jsonb_agg(
          jsonb_build_object(
            'id', c.id,
            'name', c.name,
            'created_at', c.created_at,
            'updated_at', c.updated_at
          )
        )
        FROM product_categories pc2
        INNER JOIN categories c ON pc2.category_id = c.id
        WHERE pc2.product_id = rp.id
      ),
      '[]'::jsonb
    ) as categories
  FROM random_products rp;
END;
$$ LANGUAGE plpgsql;

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_product_categories_category_id_product_id ON product_categories (category_id, product_id);

CREATE INDEX IF NOT EXISTS idx_products_status_image ON products (status, image)
WHERE
    status = 'public'
    AND image IS NOT NULL;