import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default async function ListingDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const { data: listing, error } = await supabase
    .from("listings")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !listing) {
    return (
      <main className="p-10">
        <h1 className="text-3xl font-bold">Listing not found</h1>
        <Link href="/listings" className="mt-4 inline-block text-green-700">
          Back to Listings
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#FAF8F2] px-6 py-10">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/listings"
          className="mb-6 inline-block font-semibold text-green-700"
        >
          Back to Listings
        </Link>

        <div className="overflow-hidden rounded-3xl bg-white shadow-sm">
          {listing.image_url ? (
            <img
              src={listing.image_url}
              alt={listing.title}
              className="h-[500px] w-full object-cover"
            />
          ) : (
            <div className="h-[500px] w-full bg-gray-200" />
          )}

          <div className="p-8">
            <h1 className="mb-4 text-5xl font-bold text-slate-900">
              {listing.title}
            </h1>

            <p className="mb-6 text-2xl text-slate-600">
              {listing.city}, {listing.neighborhood}
            </p>

            <p className="mb-8 text-4xl font-bold text-green-700">
              KSh {Number(listing.price).toLocaleString()}
            </p>

            <div className="mb-10 flex flex-wrap gap-4">
              <a
                href={`https://wa.me/254700000000?text=Hello%20I%20am%20interested%20in%20${encodeURIComponent(
                  listing.title
                )}`}
                target="_blank"
                className="rounded-xl bg-green-600 px-6 py-4 font-semibold text-white hover:bg-green-700"
              >
                WhatsApp Seller
              </a>

              <a
                href="tel:+254700000000"
                className="rounded-xl border border-slate-300 px-6 py-4 font-semibold hover:bg-slate-100"
              >
                Call Seller
              </a>
            </div>

            <h2 className="mb-4 text-3xl font-bold">Description</h2>
            <p className="text-lg leading-8 text-slate-700">
              {listing.description}
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
