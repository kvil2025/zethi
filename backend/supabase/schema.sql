-- ─── Esquema de Sethi en Supabase ───────────────────────────────────────────
-- Pega este contenido en Supabase → SQL Editor → Run.

create table if not exists public.usuarios (
  id uuid primary key,
  perfil jsonb not null default '{}'::jsonb,
  historial jsonb not null default '[]'::jsonb,
  creado timestamptz not null default now(),
  actualizado timestamptz not null default now()
);

-- Seguridad: bloqueamos el acceso directo desde el navegador.
-- Solo tu backend (con la clave service_role) puede leer y escribir.
alter table public.usuarios enable row level security;
