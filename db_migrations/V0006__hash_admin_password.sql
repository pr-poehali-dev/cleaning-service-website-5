-- Обновление паролей пользователей на хэшированные версии (SHA-256)
UPDATE t_p89410065_cleaning_service_web.users
SET password_hash = '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918'
WHERE username = 'admin';