"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function AdminPage() {
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchListings();
  }, []);

  async function fetchListings() {
    const { data, error } = await supabase
      .from("listings")
      .select("*")
      .eq("status", "pending")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setListings(data);
    }

    setLoading(false);
  }

  async function approveListing(id: string) {
    const { error } = await supabase
      .from("listings")
      .update({ status: "active" })
      .eq("id", id);

    if (!error) {
      setListings((prev) =>
        prev.filter((listing) => listing.id !== id)
      );
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f5f3ee] p-10">
        Loading...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f5f3ee] p-10">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-5xl font-bold text-slate-900 mb-3">
          Admin Review
        </h1>

        <p className="text-slate-600 mb-10">
          Review pending property listings before they go live.
        </p>

        <div className="space-y-6">
          {listings.length === 0 && (
            <div className="bg-white rounded-2xl shadow p-6">
              No pending listings.
            </div>
          )}

          {listings.map((listing) => (
            <div
              key={listing.id}
              className="bg-white rounded-2xl shadow overflow-hidden"
            >
              {listing.image_url && (
                <img
                  src={listing.image_url}
                  alt={listing.title}
                  className="w-full h-72 object-cover"
                />
              )}

              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold">
                    {listing.title}
                  </h2>

                  <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
                    Pending
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 text-slate-700 mb-6">
                  <p>
                    <strong>Type:</strong> {listing.property_type}
                  </p>

                  <p>
                    <strong>Status:</strong> {listing.listing_type}
                  </p>

                  <p>
                    <strong>City:</strong> {listing.city}
                  </p>

                  <p>
                    <strong>Neighborhood:</strong> {listing.neighborhood}
                  </p>

                  <p>
                    <strong>Price:</strong> $
                    {Number(listing.price).toLocaleString()}
                  </p>
                </div>

                <p className="text-slate-600 leading-7 mb-6">
                  {listing.description}
                </p>

                <button
                  onClick={() => approveListing(listing.id)}
                  className="bg-green-700 hover:bg-green-800 text-white px-6 py-3 rounded-xl font-semibold transition"
                >
                  Approve Listing
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}