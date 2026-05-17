alter table public.listings
add column if not exists property_identifier text;

create unique index if not exists listings_property_identifier_unique
on public.listings (lower(property_identifier))
where property_identifier is not null and property_identifier <> '';
