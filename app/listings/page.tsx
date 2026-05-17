import { supabase } from "@/lib/supabase";
import Link from "next/link";
import BrandLogo from "@/components/BrandLogo";

export default async function ListingsPage() {
  const { data: listings, error } = await supabase
    .from("listings")
    .select("*")
    .eq("status", "active")
    .order("created_at", { ascending: false });

  if (error) {
    return <pre>{JSON.stringify(error, null, 2)}</pre>;
  }

  return (
    <main className="min-h-screen bg-[#FAF8F2] px-6 py-8 text-[#1F2933]">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-center justify-between">
          <BrandLogo />

          <div className="flex flex-wrap items-center gap-3">
            <Link href="/market" className="font-semibold text-[#0B5D3B]">
              Market Overview
            </Link>

            <Link
              href="/post-listing"
              className="rounded-xl bg-[#0B5D3B] px-4 py-2 text-white"
            >
              Post Listing
            </Link>
          </div>
        </div>

        <h1 className="mb-2 text-4xl font-bold">
          Browse Verified Properties
        </h1>

        <p className="mb-8 text-gray-700">
          Search homes, land, and rentals across East Africa.
        </p>

        <div className="grid gap-6 md:grid-cols-3">
          {listings?.map((listing) => (
            <Link
              href={`/listings/${listing.id}`}
              key={listing.id}
              className="overflow-hidden rounded-3xl bg-white shadow-sm transition hover:scale-[1.02]"
            >
              {listing.image_url ? (
                <img
                  src={listing.image_url}
                  alt={listing.title}
                  className="h-44 w-full object-cover"
                />
              ) : (
                <div className="h-44 w-full bg-gray-200" />
              )}

              <div className="p-6">
                <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-700">
                  {listing.verification_status || "unverified"}
                </span>

                <h2 className="mt-4 text-2xl font-bold text-slate-900">
                  {listing.title}
                </h2>

                <p className="mt-2 text-lg text-slate-600">
                  {listing.city}
                </p>

                <p className="mt-5 text-2xl font-bold text-green-700">
                  KSh {Number(listing.price).toLocaleString()}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
