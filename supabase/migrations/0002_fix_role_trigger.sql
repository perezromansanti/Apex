-- Fix: prevent_self_role_change bloqueaba tambien los updates hechos desde
-- el SQL Editor o con la service_role key (current_user != 'authenticated'),
-- porque is_admin() depende de auth.uid() y ahi no hay sesion de usuario.
create or replace function public.prevent_self_role_change()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if current_user = 'authenticated'
     and new.rol is distinct from old.rol
     and not public.is_admin() then
    new.rol := old.rol;
  end if;
  return new;
end;
$$;
