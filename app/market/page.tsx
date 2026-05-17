import Link from "next/link";
import BrandLogo from "@/components/BrandLogo";
import { supabase } from "@/lib/supabase";

type SearchParams = Promise<{
  city?: string;
  neighborhood?: string;
  property_type?: string;
  listing_type?: string;
  max_price?: string;
}>;

type Listing = {
  id: string;
  title: string;
  city: string | null;
  neighborhood: string | null;
  property_type: string | null;
  listing_type: string | null;
  price: number | null;
  verification_status: string | null;
};

function formatCurrency(value: number) {
  return `KSh ${Math.round(value).toLocaleString()}`;
}

export default async function MarketOverviewPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;

  let query = supabase
    .from("listings")
    .select(
      "id,title,city,neighborhood,property_type,listing_type,price,verification_status"
    )
    .eq("status", "active")
    .order("created_at", { ascending: false });

  if (params.city) {
    query = query.ilike("city", `%${params.city}%`);
  }

  if (params.neighborhood) {
    query = query.ilike("neighborhood", `%${params.neighborhood}%`);
  }

  if (params.property_type) {
    query = query.eq("property_type", params.property_type);
  }

  if (params.listing_type) {
    query = query.eq("listing_type", params.listing_type);
  }

  if (params.max_price) {
    query = query.lte("price", Number(params.max_price));
  }

  const { data, error } = await query;
  const listings = ((data || []) as Listing[]).filter(
    (listing) => typeof listing.price === "number"
  );

  const prices = listings.map((listing) => Number(listing.price));
  const averagePrice =
    prices.length > 0
      ? prices.reduce((total, price) => total + price, 0) / prices.length
      : 0;
  const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
  const maxPrice = prices.length > 0 ? Math.max(...prices) : 0;

  return (
    <main className="min-h-screen bg-[#FAF8F2] px-6 py-8 text-[#1F2933]">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <BrandLogo />

          <Link
            href="/post-listing"
            className="rounded-xl bg-[#0B5D3B] px-4 py-2 text-center font-semibold text-white"
          >
            Post Listing
          </Link>
        </div>

        <section className="mb-8">
          <p className="mb-3 font-semibold text-[#D6A84F]">
            Market overview
          </p>
          <h1 className="max-w-3xl text-4xl font-bold md:text-5xl">
            Search verified listings before pricing or approving a property.
          </h1>
          <p className="mt-4 max-w-3xl text-lg text-slate-700">
            Use this page to compare similar homes, rentals, land, and
            commercial listings by location, type, and price range.
          </p>
        </section>

        <form className="mb-8 grid gap-3 rounded-2xl bg-white p-4 shadow-lg md:grid-cols-6">
          <input
            name="city"
            defaultValue={params.city || ""}
            className="rounded-xl border p-3"
            placeholder="City"
          />

          <input
            name="neighborhood"
            defaultValue={params.neighborhood || ""}
            className="rounded-xl border p-3"
            placeholder="Neighborhood"
          />

          <select
            name="property_type"
            defaultValue={params.property_type || ""}
            className="rounded-xl border p-3"
          >
            <option value="">Any property</option>
            <option value="apartment">Apartment</option>
            <option value="house">House</option>
            <option value="land">Land</option>
            <option value="commercial">Commercial</option>
          </select>

          <select
            name="listing_type"
            defaultValue={params.listing_type || ""}
            className="rounded-xl border p-3"
          >
            <option value="">Rent or sale</option>
            <option value="rent">Rent</option>
            <option value="sale">Sale</option>
          </select>

          <input
            name="max_price"
            defaultValue={params.max_price || ""}
            className="rounded-xl border p-3"
            placeholder="Max price"
          />

          <button className="rounded-xl bg-[#0B5D3B] p-3 font-semibold text-white">
            Search Market
          </button>
        </form>

        {error ? (
          <div className="rounded-2xl bg-red-50 p-5 text-red-700">
            Could not load market data.
          </div>
        ) : (
          <>
            <div className="mb-8 grid gap-4 md:grid-cols-4">
              <div className="rounded-2xl bg-white p-5 shadow-sm">
                <p className="text-sm font-semibold text-slate-500">
                  Matching listings
                </p>
                <p className="mt-2 text-3xl font-bold">{listings.length}</p>
              </div>
              <div className="rounded-2xl bg-white p-5 shadow-sm">
                <p className="text-sm font-semibold text-slate-500">
                  Average price
                </p>
                <p className="mt-2 text-3xl font-bold">
                  {averagePrice ? formatCurrency(averagePrice) : "No data"}
                </p>
              </div>
              <div className="rounded-2xl bg-white p-5 shadow-sm">
                <p className="text-sm font-semibold text-slate-500">
                  Lowest price
                </p>
                <p className="mt-2 text-3xl font-bold">
                  {minPrice ? formatCurrency(minPrice) : "No data"}
                </p>
              </div>
              <div className="rounded-2xl bg-white p-5 shadow-sm">
                <p className="text-sm font-semibold text-slate-500">
                  Highest price
                </p>
                <p className="mt-2 text-3xl font-bold">
                  {maxPrice ? formatCurrency(maxPrice) : "No data"}
                </p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {listings.map((listing) => (
                <Link
                  key={listing.id}
                  href={`/listings/${listing.id}`}
                  className="rounded-2xl bg-white p-5 shadow-sm transition hover:shadow-md"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h2 className="text-xl font-bold">{listing.title}</h2>
                      <p className="mt-1 text-slate-600">
                        {listing.city}
                        {listing.neighborhood
                          ? `, ${listing.neighborhood}`
                          : ""}
                      </p>
                    </div>
                    <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-700">
                      {listing.verification_status || "unverified"}
                    </span>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-3 text-sm text-slate-600">
                    <span>{listing.property_type}</span>
                    <span>{listing.listing_type}</span>
                  </div>

                  <p className="mt-4 text-2xl font-bold text-green-700">
                    {formatCurrency(Number(listing.price))}
                  </p>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
