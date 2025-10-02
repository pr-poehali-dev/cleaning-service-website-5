-- Создание таблицы клиентов для регистрации на главной странице
CREATE TABLE IF NOT EXISTS t_p89410065_cleaning_service_web.clients (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(50),
    login VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(64) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_clients_login ON t_p89410065_cleaning_service_web.clients(login);
CREATE INDEX idx_clients_email ON t_p89410065_cleaning_service_web.clients(email);