# Club deportivo — gestión de inscripciones

Stack: Next.js (App Router) · Supabase (Postgres + Auth) · Vercel (deploy + Cron) · Telegram Bot.

## 1. Crear proyecto Supabase

1. Crea un proyecto en [supabase.com](https://supabase.com).
2. En **SQL Editor**, ejecuta el contenido de [`supabase/migrations/0001_init.sql`](supabase/migrations/0001_init.sql). Crea las tablas `users`, `pruebas`, `inscripciones`, el trigger que sincroniza `auth.users` → `public.users`, y las políticas RLS.
3. En **Authentication → Providers**, deja habilitado el login por email (magic link / OTP). No hace falta contraseña: los socios reciben un enlace de acceso.
4. En **Authentication → URL Configuration**, añade como Redirect URL:
   - `http://localhost:3000/auth/callback` (desarrollo)
   - `https://<tu-dominio-vercel>/auth/callback` (producción)
5. Da de alta al primer admin: registra su email desde la app (recibirá el magic link, se crea su fila en `public.users` con rol `socio`), y luego en el SQL Editor:
   ```sql
   update public.users set rol = 'admin' where email = 'tu-email@club.com';
   ```

## 2. Variables de entorno

Copia `.env.local.example` a `.env.local` y rellena:

- `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Project Settings → API.
- `SUPABASE_SERVICE_ROLE_KEY` — misma pantalla, clave `service_role` (secreta, solo se usa en el cron server-side, nunca en el cliente).
- `TELEGRAM_BOT_TOKEN` — token del bot creado con [@BotFather](https://t.me/BotFather).
- `TELEGRAM_CHAT_ID` — id del grupo al que se envían los recordatorios (añade el bot al grupo y consulta `getUpdates` o usa [@myidbot](https://t.me/myidbot)).
- `CRON_SECRET` — cadena aleatoria; protege el endpoint `/api/cron/reminder`.

## 3. Desarrollo local

```bash
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

## 4. Estructura

- `src/app/login` — login socios (magic link).
- `src/app/pruebas` — listado de pruebas, inscribirse/cancelar (respeta `fecha_limite_inscripcion`, reforzado por RLS).
- `src/app/admin` — CRUD de pruebas, ver inscritos, exportar CSV.
- `src/app/api/inscripciones` — alta/baja de inscripción (socio autenticado).
- `src/app/api/admin/pruebas` — CRUD pruebas (solo admin).
- `src/app/api/admin/pruebas/[id]/export` — CSV de inscritos para la federación.
- `src/app/api/cron/reminder` — recordatorio semanal a Telegram (protegido con `CRON_SECRET`).
- `src/lib/supabase` — clientes browser/server/admin + tipos de la base de datos.
- `supabase/migrations` — schema SQL + RLS.

## 5. Deploy en Vercel

1. Conecta el repo de GitHub en [vercel.com/new](https://vercel.com/new).
2. Añade las mismas variables de entorno del paso 2 en Project Settings → Environment Variables (incluye `CRON_SECRET`; Vercel lo envía automáticamente como header `Authorization: Bearer <CRON_SECRET>` en las llamadas de Cron).
3. El fichero [`vercel.json`](vercel.json) ya define el cron semanal (lunes 8:00 UTC) contra `/api/cron/reminder`. Ajusta el `schedule` si quieres otro día/hora.
4. Verifica el redirect URL de Supabase con el dominio final de Vercel (paso 1.4).

## 6. Notas de seguridad

- RLS en `pruebas`/`inscripciones` obliga a que alta y baja de inscripción respeten `fecha_limite_inscripcion` incluso si alguien llama a la API directamente.
- `SUPABASE_SERVICE_ROLE_KEY` solo se usa en `src/lib/supabase/admin.ts` (server-only), para el cron que corre sin sesión de usuario.
- El rol (`admin`/`socio`) solo se puede cambiar desde el SQL Editor o por otro admin. Un trigger (`prevent_self_role_change`) bloquea a nivel de base de datos que un socio se auto-promocione a admin, incluso si llamase directamente a la API de Supabase.
