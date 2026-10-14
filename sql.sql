-- Crear la tabla de capybaras
create table capybaras (
  id uuid default gen_random_uuid() primary key,
  nombre text not null,
  edad integer not null,
  peso numeric not null,
  lugar text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Habilitar RLS (Row Level Security)
alter table capybaras enable row level security;

-- Crear política para permitir lectura pública
create policy "Permitir lectura pública de capybaras"
  on capybaras for select
  using (true);

-- Crear política para permitir inserción pública (o ajústala según tus reglas de autenticación)
create policy "Permitir inserción pública de capybaras"
  on capybaras for insert
  with check (true);