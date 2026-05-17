alter table public.listings
add column if not exists document_urls text[] not null default '{}';
