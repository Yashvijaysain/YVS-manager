-- Fix security definer functions with proper search_path
CREATE OR REPLACE FUNCTION public.get_dashboard_stats()
RETURNS TABLE (
  total_teachers BIGINT,
  total_students BIGINT,
  total_parents BIGINT,
  active_classes BIGINT
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    (SELECT COUNT(*) FROM public.teachers) as total_teachers,
    (SELECT COUNT(*) FROM public.students) as total_students,
    (SELECT COUNT(*) FROM public.parents) as total_parents,
    (SELECT COUNT(DISTINCT class_name) FROM public.students) as active_classes;
$$;

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
SET search_path = public
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