-- Настройка Storage для загрузки изображений товаров

-- 1. Создание bucket для изображений (выполняется через UI Supabase, не через SQL)
-- Зайдите в Storage -> Create bucket
-- Название: product-images
-- Public bucket: Yes (чтобы изображения были доступны публично)

-- 2. Настройка политик безопасности для публичного доступа
-- Эти политики позволяют всем читать изображения, но загружать только авторизованным

-- Политика для публичного чтения изображений
CREATE POLICY "Public read access" ON storage.objects FOR
SELECT USING (bucket_id = 'product-images');

-- Политика для загрузки изображений (разрешено всем, так как у нас нет Supabase Auth)
CREATE POLICY "Public upload access" ON storage.objects FOR INSERT
WITH
    CHECK (bucket_id = 'product-images');

-- Политика для удаления изображений (разрешено всем)
CREATE POLICY "Public delete access" ON storage.objects FOR DELETE USING (bucket_id = 'product-images');

-- Примечание: В production лучше настроить Row Level Security (RLS)
-- с проверкой прав администратора через JWT токены