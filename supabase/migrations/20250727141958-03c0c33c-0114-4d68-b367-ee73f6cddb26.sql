-- Create storage bucket for user photos
INSERT INTO storage.buckets (id, name, public) VALUES ('user-photos', 'user-photos', true);

-- Create storage policies for user photos
CREATE POLICY "Anyone can view user photos" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'user-photos');

CREATE POLICY "Authenticated users can upload photos" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'user-photos' AND auth.role() = 'authenticated');

CREATE POLICY "Users can update their own photos" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'user-photos' AND auth.role() = 'authenticated');

CREATE POLICY "Users can delete their own photos" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'user-photos' AND auth.role() = 'authenticated');

-- Add missing fields to profiles table
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS photo_url TEXT;

-- Add missing fields to teachers table
ALTER TABLE public.teachers ADD COLUMN IF NOT EXISTS employee_id TEXT UNIQUE;
ALTER TABLE public.teachers ADD COLUMN IF NOT EXISTS class_assigned TEXT;

-- Add missing fields to students table  
ALTER TABLE public.students ADD COLUMN IF NOT EXISTS student_id TEXT UNIQUE;
ALTER TABLE public.students ADD COLUMN IF NOT EXISTS parent_name TEXT;

-- Add missing fields to parents table
ALTER TABLE public.parents ADD COLUMN IF NOT EXISTS child_name TEXT;

-- Create function to get real-time counts
CREATE OR REPLACE FUNCTION public.get_dashboard_stats()
RETURNS TABLE (
  total_teachers BIGINT,
  total_students BIGINT,
  total_parents BIGINT,
  active_classes BIGINT
)
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT 
    (SELECT COUNT(*) FROM public.teachers) as total_teachers,
    (SELECT COUNT(*) FROM public.students) as total_students,
    (SELECT COUNT(*) FROM public.parents) as total_parents,
    (SELECT COUNT(DISTINCT class_name) FROM public.students) as active_classes;
$$;

-- Create function to get recent registrations
CREATE OR REPLACE FUNCTION public.get_recent_registrations()
RETURNS TABLE (
  name TEXT,
  role user_role,
  department TEXT,
  class_name TEXT,
  relation TEXT,
  created_at TIMESTAMP WITH TIME ZONE
)
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT 
    p.name,
    p.role,
    COALESCE(t.department, '') as department,
    COALESCE(s.class_name, '') as class_name,
    COALESCE(par.relationship, '') as relation,
    p.created_at
  FROM public.profiles p
  LEFT JOIN public.teachers t ON t.profile_id = p.id
  LEFT JOIN public.students s ON s.profile_id = p.id
  LEFT JOIN public.parents par ON par.profile_id = p.id
  ORDER BY p.created_at DESC
  LIMIT 10;
$$;

-- Enable realtime for tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.profiles;
ALTER PUBLICATION supabase_realtime ADD TABLE public.teachers;
ALTER PUBLICATION supabase_realtime ADD TABLE public.students;
ALTER PUBLICATION supabase_realtime ADD TABLE public.parents;