-- Fix demo-user password hashes to match the documented DemoPass!2026 password.
-- This migration corrects the BCrypt values seeded in V2__seed_demo_data.sql.

UPDATE users
SET password_hash = '$2b$10$jtbSeIskAe0colBmeZpRR.4LKfAFLlKaacLuGJvt6IGpHcrGcmNyy',
    updated_at = NOW()
WHERE email IN (
    'dispatcher@demo.civicflow.app',
    'technician@demo.civicflow.app',
    'lighting.tech@demo.civicflow.app',
    'parks.tech@demo.civicflow.app',
    'admin@demo.civicflow.app',
    'resident@demo.civicflow.app'
);
