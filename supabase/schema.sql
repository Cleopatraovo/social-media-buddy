-- Testlauf: einfache Tabelle für erfundene Beispieldaten.
-- Im Supabase-Dashboard unter "SQL Editor" einfügen und mit "Run" ausführen.

create table if not exists public.test_entries (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  participant_code text not null,
  score smallint not null check (score between 1 and 5),
  note text
);

alter table public.test_entries enable row level security;

-- NUR FÜR DEN TESTLAUF: jeder mit dem öffentlichen Key darf schreiben und lesen.
-- Für die echte Studie werden diese Regeln durch strengere ersetzt,
-- sodass jede Person nur ihre eigenen Einträge sieht.
create policy "test_insert" on public.test_entries
  for insert to anon with check (true);

create policy "test_select" on public.test_entries
  for select to anon using (true);
