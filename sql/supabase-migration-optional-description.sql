-- Миграция: делаем описание товара необязательным

ALTER TABLE products ALTER COLUMN description DROP NOT NULL;

-- Теперь можно создавать товары без описания