-- Añade categoria y dorsal a users, y hace que el trigger de alta
-- (handle_new_user) los rellene desde los metadatos que manda /registro.
alter table public.users
  add column categoria text,
  add column dorsal integer unique;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.users (id, nombre, apellido, email, categoria, dorsal)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'nombre', ''),
    coalesce(new.raw_user_meta_data ->> 'apellido', ''),
    new.email,
    new.raw_user_meta_data ->> 'categoria',
    (new.raw_user_meta_data ->> 'dorsal')::integer
  );
  return new;
end;
$$;
