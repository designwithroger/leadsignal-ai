create extension if not exists "pgcrypto";

create type public.offer_type as enum ('website_audit', 'seo', 'ads', 'social_media', 'automation', 'custom');
create type public.search_status as enum ('queued', 'running', 'completed', 'failed');
create type public.lead_status as enum ('new', 'analyzed', 'failed');
create type public.subscription_status as enum ('free', 'trialing', 'active', 'past_due', 'canceled');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  company_name text,
  credits integer not null default 25 check (credits >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.customer_accounts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references public.profiles(id) on delete cascade,
  stripe_customer_id text unique,
  subscription_status public.subscription_status not null default 'free',
  plan_key text not null default 'free',
  current_period_end timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.searches (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  niche text not null,
  city text not null,
  country text not null,
  quantity integer not null check (quantity between 1 and 50),
  offer_type public.offer_type not null,
  language text not null default 'English',
  tone text not null default 'friendly',
  status public.search_status not null default 'queued',
  error_message text,
  created_at timestamptz not null default now(),
  completed_at timestamptz
);

create table public.leads (
  id uuid primary key default gen_random_uuid(),
  search_id uuid not null references public.searches(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  place_id text,
  name text not null,
  address text,
  phone text,
  website text,
  google_rating numeric,
  google_reviews integer,
  status public.lead_status not null default 'new',
  website_signals jsonb not null default '{}'::jsonb,
  opportunity_score integer not null default 0 check (opportunity_score between 0 and 100),
  ai_summary text,
  ai_main_problems jsonb not null default '[]'::jsonb,
  recommended_offer text,
  reason_to_contact text,
  outreach_openers jsonb not null default '[]'::jsonb,
  error_message text,
  created_at timestamptz not null default now(),
  analyzed_at timestamptz
);

create table public.credit_ledger (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  lead_id uuid references public.leads(id) on delete set null,
  delta integer not null,
  reason text not null,
  created_at timestamptz not null default now()
);

create index leads_search_id_idx on public.leads(search_id);
create index leads_user_score_idx on public.leads(user_id, opportunity_score desc);
create index searches_user_created_idx on public.searches(user_id, created_at desc);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', ''));

  insert into public.customer_accounts (user_id)
  values (new.id);

  insert into public.credit_ledger (user_id, delta, reason)
  values (new.id, 25, 'signup_bonus');

  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.customer_accounts enable row level security;
alter table public.searches enable row level security;
alter table public.leads enable row level security;
alter table public.credit_ledger enable row level security;

create policy "profiles are readable by owner" on public.profiles
  for select using (auth.uid() = id);
create policy "profiles are editable by owner" on public.profiles
  for update using (auth.uid() = id);

create policy "customers are readable by owner" on public.customer_accounts
  for select using (auth.uid() = user_id);

create policy "searches are owned" on public.searches
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "leads are owned" on public.leads
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "ledger is readable by owner" on public.credit_ledger
  for select using (auth.uid() = user_id);
