-- Script SQL để thêm bảng orders và order_items vào Supabase
-- Chạy script này trong SQL Editor của Supabase

-- Tạo bảng orders
CREATE TABLE IF NOT EXISTS orders (
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

-- Tạo bảng order_items
CREATE TABLE IF NOT EXISTS order_items (
    id SERIAL PRIMARY KEY,
    order_id VARCHAR(255) REFERENCES orders (order_id) ON DELETE CASCADE,
    product_id INTEGER REFERENCES products (id) ON DELETE CASCADE,
    product_name VARCHAR(255) NOT NULL,
    product_price INTEGER NOT NULL,
    quantity INTEGER NOT NULL,
    item_note TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tạo trigger để tự động cập nhật updated_at cho bảng orders
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Áp dụng trigger cho bảng orders
DROP TRIGGER IF EXISTS update_orders_modtime ON orders;

CREATE TRIGGER update_orders_modtime
BEFORE UPDATE ON orders
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

-- Bật Row Level Security cho các bảng
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Tạo policies cho authenticated users (admin)
CREATE POLICY "Allow full access to authenticated users" ON orders FOR ALL USING (
    auth.role () = 'authenticated'
);

CREATE POLICY "Allow full access to authenticated users" ON order_items FOR ALL USING (
    auth.role () = 'authenticated'
);

-- Tạo indexes để tối ưu hiệu suất
CREATE INDEX IF NOT EXISTS idx_orders_order_id ON orders (order_id);

CREATE INDEX IF NOT EXISTS idx_orders_status ON orders (status);

CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON orders (payment_status);

CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders (created_at);

CREATE INDEX IF NOT EXISTS idx_orders_customer_phone1 ON orders (customer_phone1);

CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items (order_id);

CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON order_items (product_id);

-- Thêm comment cho các bảng
COMMENT ON TABLE orders IS 'Bảng lưu trữ thông tin đơn hàng';

COMMENT ON TABLE order_items IS 'Bảng lưu trữ chi tiết sản phẩm trong đơn hàng';

-- Thêm comment cho các cột quan trọng
COMMENT ON COLUMN orders.order_id IS 'Mã đơn hàng duy nhất';

COMMENT ON COLUMN orders.customer_name IS 'Tên khách hàng';

COMMENT ON COLUMN orders.customer_phone1 IS 'Số điện thoại chính';

COMMENT ON COLUMN orders.customer_phone2 IS 'Số điện thoại phụ';

COMMENT ON COLUMN orders.customer_address IS 'Địa chỉ giao hàng';

COMMENT ON COLUMN orders.total_price IS 'Tổng tiền đơn hàng (VND)';

COMMENT ON COLUMN orders.status IS 'Trạng thái đơn hàng: pending, paid, delivered, cancelled';

COMMENT ON COLUMN orders.payment_status IS 'Trạng thái thanh toán: unpaid, paid, refunded';

COMMENT ON COLUMN orders.paid_at IS 'Thời gian thanh toán';

COMMENT ON COLUMN orders.delivered_at IS 'Thời gian giao hàng';

COMMENT ON COLUMN order_items.order_id IS 'Mã đơn hàng (foreign key)';

COMMENT ON COLUMN order_items.product_id IS 'ID sản phẩm (foreign key)';

COMMENT ON COLUMN order_items.product_name IS 'Tên sản phẩm tại thời điểm đặt hàng';

COMMENT ON COLUMN order_items.product_price IS 'Giá sản phẩm tại thời điểm đặt hàng (VND)';

COMMENT ON COLUMN order_items.quantity IS 'Số lượng sản phẩm';

COMMENT ON COLUMN order_items.item_note IS 'Ghi chú cho sản phẩm';

-- Kiểm tra kết quả
SELECT 'Bảng orders và order_items đã được tạo thành công!' as message;