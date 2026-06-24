alter table public.leads
add column if not exists ai_main_problems jsonb not null default '[]'::jsonb;
