-- Добавляем поля для хранения желаемой даты и времени уборки
ALTER TABLE bookings ADD COLUMN booking_date DATE;
ALTER TABLE bookings ADD COLUMN booking_time TIME;