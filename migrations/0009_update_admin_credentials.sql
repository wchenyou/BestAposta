-- Update admin user credentials
-- First delete existing admin users
DELETE FROM admin_users;

-- Insert new admin user with specified credentials
-- Username/Email: wchenyou@gmail.com
-- Password: Aaron12345678
-- Bcrypt hash generated with salt rounds 10

INSERT INTO admin_users (username, password_hash, email) VALUES (
  'wchenyou@gmail.com',
  '$2b$10$OMOjwMXB4GJkhanjv9b.huYL/2SwC5IsVN.HHV3z9/puCtTVxZrFq',
  'wchenyou@gmail.com'
);