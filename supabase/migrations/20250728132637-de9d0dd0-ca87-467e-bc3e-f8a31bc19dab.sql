-- Update the get_recent_registrations function to include profile_id
CREATE OR REPLACE FUNCTION public.get_recent_registrations()
 RETURNS TABLE(profile_id uuid, name text, role user_role, department text, class_name text, relation text, created_at timestamp with time zone)
 LANGUAGE sql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  SELECT 
    p.id as profile_id,
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
$function$