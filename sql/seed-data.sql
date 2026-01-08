-- Тестовые данные для рыболовного магазина

-- Очистка существующих данных
TRUNCATE TABLE products CASCADE;

TRUNCATE TABLE categories CASCADE;

-- Добавление категорий
INSERT INTO
    categories (name)
VALUES ('Спиннинги'),
    ('Катушки'),
    ('Приманки'),
    ('Леска и шнуры'),
    ('Крючки'),
    ('Удочки'),
    ('Снасти'),
    ('Аксессуары');

-- Добавление товаров

-- Спиннинги
INSERT INTO
    products (
        name,
        description,
        price,
        image_url,
        category_id,
        in_stock
    )
VALUES (
        'Спиннинг Shimano Catana CX 240M',
        'Универсальный спиннинг для джига и воблеров. Длина 2.4м, тест 7-21г. Идеален для ловли щуки и окуня.',
        4500,
        'https://images.unsplash.com/photo-1534043464124-3be32fe000c9?w=500',
        (
            SELECT id
            FROM categories
            WHERE
                name = 'Спиннинги'
        ),
        true
    ),
    (
        'Спиннинг Daiwa Ninja X 270UL',
        'Ультралайтовый спиннинг для деликатной ловли. Длина 2.7м, тест 1-7г. Отлично подходит для форели и окуня.',
        6200,
        'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=500',
        (
            SELECT id
            FROM categories
            WHERE
                name = 'Спиннинги'
        ),
        true
    );

-- Катушки
INSERT INTO
    products (
        name,
        description,
        price,
        image_url,
        category_id,
        in_stock
    )
VALUES (
        'Катушка Shimano Nexave 2500FE',
        'Безынерционная катушка с передним фрикционом. 4 подшипника, передаточное число 5.0:1.',
        3800,
        'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500',
        (
            SELECT id
            FROM categories
            WHERE
                name = 'Катушки'
        ),
        true
    ),
    (
        'Катушка Daiwa Legalis LT 3000',
        'Легкая и прочная катушка. 5 подшипников, система LT (Light & Tough), плавный ход.',
        7500,
        'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500',
        (
            SELECT id
            FROM categories
            WHERE
                name = 'Катушки'
        ),
        false
    );

-- Приманки
INSERT INTO
    products (
        name,
        description,
        price,
        image_url,
        category_id,
        in_stock
    )
VALUES (
        'Воблер Rapala Original Floating F09',
        'Классический воблер для ловли щуки и окуня. Длина 9см, вес 5г, плавающий.',
        850,
        'https://images.unsplash.com/photo-1616966220216-018fead743c0?w=500',
        (
            SELECT id
            FROM categories
            WHERE
                name = 'Приманки'
        ),
        true
    ),
    (
        'Набор силиконовых приманок "Активный хищник"',
        'Набор из 10 твистеров и виброхвостов разных цветов. Размер 7-10см.',
        650,
        'https://images.unsplash.com/photo-1534043464124-3be32fe000c9?w=500',
        (
            SELECT id
            FROM categories
            WHERE
                name = 'Приманки'
        ),
        true
    ),
    (
        'Блесна колеблющка Mepps Syclops №3',
        'Универсальная колеблющаяся блесна. Вес 18г, серебристый цвет.',
        420,
        'https://images.unsplash.com/photo-1545450660-1e0c13f0c7a5?w=500',
        (
            SELECT id
            FROM categories
            WHERE
                name = 'Приманки'
        ),
        true
    );

-- Леска и шнуры
INSERT INTO
    products (
        name,
        description,
        price,
        image_url,
        category_id,
        in_stock
    )
VALUES (
        'Плетеный шнур Power Pro 0.15мм 135м',
        'Качественный 4-жильный плетеный шнур. Разрывная нагрузка 9кг. Цвет: темно-зеленый.',
        1850,
        'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=500',
        (
            SELECT id
            FROM categories
            WHERE
                name = 'Леска и шнуры'
        ),
        true
    ),
    (
        'Монолеска Shimano Technium 0.25мм 150м',
        'Прочная монофильная леска. Разрывная нагрузка 7кг. Практически незаметна в воде.',
        980,
        'https://images.unsplash.com/photo-1632247610609-601dda4e7b6d?w=500',
        (
            SELECT id
            FROM categories
            WHERE
                name = 'Леска и шнуры'
        ),
        true
    );

-- Крючки
INSERT INTO
    products (
        name,
        description,
        price,
        image_url,
        category_id,
        in_stock
    )
VALUES (
        'Крючки Owner №4 (10шт)',
        'Японские крючки высочайшего качества. Острые, прочные, антикоррозийное покрытие.',
        320,
        'https://images.unsplash.com/photo-1606318313616-48c8f5f6c1b3?w=500',
        (
            SELECT id
            FROM categories
            WHERE
                name = 'Крючки'
        ),
        true
    ),
    (
        'Офсетные крючки Gamakatsu 3/0 (5шт)',
        'Офсетные крючки для монтажа силиконовых приманок. Идеальны для техасской оснастки.',
        450,
        'https://images.unsplash.com/photo-1593642532400-2682810df593?w=500',
        (
            SELECT id
            FROM categories
            WHERE
                name = 'Крючки'
        ),
        true
    );

-- Удочки
INSERT INTO
    products (
        name,
        description,
        price,
        image_url,
        category_id,
        in_stock
    )
VALUES (
        'Поплавочная удочка Mikado Princess 500',
        'Телескопическая удочка для поплавочной ловли. Длина 5м, вес 180г.',
        2100,
        'https://images.unsplash.com/photo-1534043464124-3be32fe000c9?w=500',
        (
            SELECT id
            FROM categories
            WHERE
                name = 'Удочки'
        ),
        true
    ),
    (
        'Фидерное удилище Daiwa Black Widow 360H',
        'Мощное фидерное удилище. Длина 3.6м, тест до 120г. 3 сменные вершинки.',
        8900,
        'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=500',
        (
            SELECT id
            FROM categories
            WHERE
                name = 'Удочки'
        ),
        false
    );

-- Снасти
INSERT INTO
    products (
        name,
        description,
        price,
        image_url,
        category_id,
        in_stock
    )
VALUES (
        'Поплавок Balsa Wood 3г',
        'Классический бальзовый поплавок. Чувствительный, устойчивый на течении.',
        180,
        'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=500',
        (
            SELECT id
            FROM categories
            WHERE
                name = 'Снасти'
        ),
        true
    ),
    (
        'Грузила "Оливка" набор 5-20г',
        'Набор скользящих грузил для различных видов ловли. 20шт в наборе.',
        290,
        'https://images.unsplash.com/photo-1565043589221-1a6fd9ae45c7?w=500',
        (
            SELECT id
            FROM categories
            WHERE
                name = 'Снасти'
        ),
        true
    );

-- Аксессуары
INSERT INTO
    products (
        name,
        description,
        price,
        image_url,
        category_id,
        in_stock
    )
VALUES (
        'Подсак складной 2.5м',
        'Телескопический подсак с сеткой. Длина 2.5м, голова 60см.',
        3200,
        'https://images.unsplash.com/photo-1571225771498-2f8ca1b2db47?w=500',
        (
            SELECT id
            FROM categories
            WHERE
                name = 'Аксессуары'
        ),
        true
    ),
    (
        'Рыболовный ящик Helios 19л',
        'Пластиковый ящик для зимней рыбалки. Съемные ножки, теплое сиденье.',
        1850,
        'https://images.unsplash.com/photo-1574068068668-a7db3c77b8b6?w=500',
        (
            SELECT id
            FROM categories
            WHERE
                name = 'Аксессуары'
        ),
        true
    ),
    (
        'Садок спортивный 3м',
        'Садок из мягкой сетки для сохранения улова. Диаметр колец 40см.',
        1450,
        'https://images.unsplash.com/photo-1563207153-f403bf289096?w=500',
        (
            SELECT id
            FROM categories
            WHERE
                name = 'Аксессуары'
        ),
        true
    );