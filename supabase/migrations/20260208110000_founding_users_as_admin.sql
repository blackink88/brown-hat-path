-- Make all existing users admins (founding users).
-- Run once; only affects users that already have a row in user_roles.

UPDATE public.user_roles
SET role = 'admin'
WHERE role = 'student';
