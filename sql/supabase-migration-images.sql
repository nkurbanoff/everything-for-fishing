-- Миграция: добавление поддержки множественных изображений для товаров

-- 1. Добавляем новое поле для массива изображений
ALTER TABLE products
ADD COLUMN images TEXT [] DEFAULT ARRAY[]::TEXT [];

-- 2. Копируем существующие image_url в массив images
UPDATE products
SET
    images = ARRAY[image_url]
WHERE
    image_url IS NOT NULL
    AND image_url != '';

-- 3. Опционально: можем оставить старое поле для совместимости или удалить его
-- Рекомендую оставить на случай отката, но сделать необязательным:
ALTER TABLE products ALTER COLUMN image_url DROP NOT NULL;

-- Теперь у товара есть:
-- - image_url (TEXT) - старое поле, можно использовать как основное изображение
-- - images (TEXT[]) - новое поле, массив всех изображений

-- Примечание: В приложении будем использовать images, а image_url игнорировать