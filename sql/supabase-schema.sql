-- Создание таблицы категорий
CREATE TABLE categories (
    id UUID DEFAULT gen_random_uuid () PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Создание таблицы товаров
CREATE TABLE products (
    id UUID DEFAULT gen_random_uuid () PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    image_url TEXT NOT NULL,
    category_id UUID REFERENCES categories (id) ON DELETE CASCADE,
    in_stock BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Индексы для оптимизации запросов
CREATE INDEX idx_products_category_id ON products (category_id);

CREATE INDEX idx_products_created_at ON products (created_at DESC);

-- Включение Row Level Security (RLS)
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Политики доступа (чтение для всех, запись только для аутентифицированных)
CREATE POLICY "Публичное чтение категорий" ON categories FOR
SELECT USING (true);

CREATE POLICY "Публичное чтение товаров" ON products FOR
SELECT USING (true);

-- Для админки нужно будет отключить RLS или создать политики для анонимных пользователей
-- Если используете анонимный ключ для админки:
CREATE POLICY "Анонимная вставка категорий" ON categories FOR INSERT
WITH
    CHECK (true);

CREATE POLICY "Анонимное обновление категорий" ON categories
FOR UPDATE
    USING (true);

CREATE POLICY "Анонимное удаление категорий" ON categories FOR DELETE USING (true);

CREATE POLICY "Анонимная вставка товаров" ON products FOR INSERT
WITH
    CHECK (true);

CREATE POLICY "Анонимное обновление товаров" ON products
FOR UPDATE
    USING (true);

CREATE POLICY "Анонимное удаление товаров" ON products FOR DELETE USING (true);

-- Вставка тестовых категорий
INSERT INTO
    categories (name)
VALUES ('Удочки'),
    ('Катушки'),
    ('Приманки'),
    ('Лески'),
    ('Крючки'),
    ('Снасти');

-- Вставка тестовых товаров (примеры)
INSERT INTO
    products (
        name,
        description,
        price,
        image_url,
        category_id,
        in_stock
    )
SELECT 'Спиннинг Maximus Legend', 'Профессиональный спиннинг для ловли хищной рыбы. Длина 2.7м, тест 10-30г', 12500.00, 'https://images.unsplash.com/photo-1544552866-d3ed42536cfd?w=400', (
        SELECT id
        FROM categories
        WHERE
            name = 'Удочки'
        LIMIT 1
    ), true;