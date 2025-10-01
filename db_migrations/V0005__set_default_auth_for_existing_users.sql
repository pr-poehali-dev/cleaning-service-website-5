UPDATE t_p89410065_cleaning_service_web.users 
SET username = 'user' || id::text, 
    password_hash = 'password123' 
WHERE username IS NULL;