CREATE TABLE IF NOT EXISTS services (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    icon VARCHAR(50) NOT NULL DEFAULT 'Building2',
    price VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO services (title, description, icon, price) VALUES
('Офисная уборка', 'Профессиональная уборка офисных помещений любой площади', 'Building2', 'от 500 ₽/м²'),
('Квартиры и дома', 'Генеральная и поддерживающая уборка жилых помещений', 'Home', 'от 300 ₽/м²'),
('После ремонта', 'Уборка после строительных и ремонтных работ', 'Paintbrush', 'от 700 ₽/м²'),
('Химчистка мебели', 'Глубокая чистка мягкой мебели и ковров', 'Armchair', 'от 1500 ₽');
