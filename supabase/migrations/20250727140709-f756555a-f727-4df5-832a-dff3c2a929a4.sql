-- Create admin user account
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_user_meta_data,
  is_super_admin,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'admin@school.edu',
  crypt('admin123', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '{"name": "System Administrator"}',
  false,
  '',
  '',
  '',
  ''
);

-- Insert admin profile
INSERT INTO public.profiles (
  user_id,
  role,
  name,
  email,
  date_of_birth,
  contact_number
) VALUES (
  (SELECT id FROM auth.users WHERE email = 'admin@school.edu'),
  'admin',
  'System Administrator',
  'admin@school.edu',
  '1980-01-01',
  '+1234567890'
);