-- =========================================================
-- Club deportivo: schema inicial (users, pruebas, inscripciones)
-- =========================================================

-- ---------------------------------------------------------
-- users: espejo de auth.users con rol de negocio
-- ---------------------------------------------------------
create table public.users (
  id uuid primary key references auth.users (id) on delete cascade,
  nombre text not null,
  apellido text not null,
  email text not null unique,
  rol text not null default 'socio' check (rol in ('admin', 'socio')),
  created_at timestamptz not null default now()
);

-- crea automáticamente la fila en public.users al registrarse en auth.users
create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.users (id, nombre, apellido, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'nombre', ''),
    coalesce(new.raw_user_meta_data ->> 'apellido', ''),
    new.email
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- helper: ¿el usuario autenticado es admin?
create function public.is_admin()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from public.users where id = auth.uid() and rol = 'admin'
  );
$$;

-- ---------------------------------------------------------
-- pruebas
-- ---------------------------------------------------------
create table public.pruebas (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  fecha date not null,
  descripcion text,
  fecha_limite_inscripcion timestamptz not null,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------
-- inscripciones
-- ---------------------------------------------------------
create table public.inscripciones (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users (id) on delete cascade,
  prueba_id uuid not null references public.pruebas (id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, prueba_id)
);

create index inscripciones_prueba_id_idx on public.inscripciones (prueba_id);
create index inscripciones_user_id_idx on public.inscripciones (user_id);

-- =========================================================
-- RLS
-- =========================================================
alter table public.users enable row level security;
alter table public.pruebas enable row level security;
alter table public.inscripciones enable row level security;

-- users: cada socio ve/edita su propia fila; admin ve/edita todas
create policy "users select propia o admin"
  on public.users for select
  using (id = auth.uid() or public.is_admin());

create policy "users update propia (sin rol) o admin"
  on public.users for update
  using (id = auth.uid() or public.is_admin());

-- la policy anterior permite editar la fila propia, pero no restringe columnas:
-- sin este trigger un socio podría hacer update set rol='admin' sobre sí mismo.
-- Se bloquea el cambio de rol salvo que quien ejecuta el update sea admin.
create function public.prevent_self_role_change()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.rol is distinct from old.rol and not public.is_admin() then
    new.rol := old.rol;
  end if;
  return new;
end;
$$;

create trigger on_users_before_update
  before update on public.users
  for each row execute function public.prevent_self_role_change();

-- pruebas: lectura abierta a cualquier usuario autenticado; escritura solo admin
create policy "pruebas select autenticados"
  on public.pruebas for select
  to authenticated
  using (true);

create policy "pruebas insert admin"
  on public.pruebas for insert
  to authenticated
  with check (public.is_admin());

create policy "pruebas update admin"
  on public.pruebas for update
  to authenticated
  using (public.is_admin());

create policy "pruebas delete admin"
  on public.pruebas for delete
  to authenticated
  using (public.is_admin());

-- inscripciones: el socio ve las suyas, admin ve todas
create policy "inscripciones select propia o admin"
  on public.inscripciones for select
  to authenticated
  using (user_id = auth.uid() or public.is_admin());

-- alta: solo la propia, y solo si no ha pasado el plazo de la prueba
create policy "inscripciones insert propia antes de plazo"
  on public.inscripciones for insert
  to authenticated
  with check (
    user_id = auth.uid()
    and exists (
      select 1 from public.pruebas p
      where p.id = prueba_id
        and p.fecha_limite_inscripcion > now()
    )
  );

-- baja: solo la propia, y solo si no ha pasado el plazo de la prueba
create policy "inscripciones delete propia antes de plazo"
  on public.inscripciones for delete
  to authenticated
  using (
    user_id = auth.uid()
    and exists (
      select 1 from public.pruebas p
      where p.id = prueba_id
        and p.fecha_limite_inscripcion > now()
    )
  );

-- admin puede borrar cualquier inscripción (gestión manual)
create policy "inscripciones delete admin"
  on public.inscripciones for delete
  to authenticated
  using (public.is_admin());
