import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default async function ListingsPage() {
  const { data: listings, error } = await supabase
    .from("listings")
    .select("*")
    .eq("status", "active");

  if (error) {
    return <pre>{JSON.stringify(error, null, 2)}</pre>;
  }

  return (
    <main className="min-h-screen bg-[#FAF8F2] px-6 py-8 text-[#1F2933]">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-[#0B5D3B]">
            Haki Properties
          </Link>

          <Link
            href="/post-listing"
            className="rounded-xl bg-[#0B5D3B] px-4 py-2 text-white"
          >
            Post Listing
          </Link>
        </div>

        <h1 className="mb-2 text-4xl font-bold">Browse Verified Properties</h1>
        <p className="mb-8 text-gray-700">
          Search homes, land, and rentals across East Africa.
        </p>

        <div className="grid gap-6 md:grid-cols-3">
          {listings?.map((listing) => (
            <div key={listing.id} className="rounded-2xl bg-white p-5 shadow">
              <div className="mb-4 h-44 rounded-xl bg-gray-200" />

              <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-700">
                {listing.verification_status || "Unverified"}
              </span>

              <h2 className="mt-4 text-xl font-bold">
                {listing.title}
              </h2>

              <p className="text-gray-600">
                {listing.city}
              </p>

              <p className="mt-3 text-lg font-bold text-[#0B5D3B]">
                KSh {listing.price}
              </p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}