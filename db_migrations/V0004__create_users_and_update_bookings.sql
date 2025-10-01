-- Создание таблицы пользователей
CREATE TABLE IF NOT EXISTS t_p89410065_cleaning_service_web.users (
  id SERIAL PRIMARY KEY,
  full_name VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL UNIQUE,
  role VARCHAR(50) NOT NULL CHECK (role IN ('super_admin', 'admin', 'manager', 'operator')),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Добавление поля assignee_id в таблицу bookings
ALTER TABLE t_p89410065_cleaning_service_web.bookings 
ADD COLUMN IF NOT EXISTS assignee_id INTEGER REFERENCES t_p89410065_cleaning_service_web.users(id);

-- Создание главного администратора по умолчанию
INSERT INTO t_p89410065_cleaning_service_web.users (full_name, phone, role)
VALUES ('Главный администратор', '+79999999999', 'super_admin')
ON CONFLICT (phone) DO NOTHING;