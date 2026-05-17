"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import BrandLogo from "@/components/BrandLogo";
import { supabase } from "@/lib/supabase";

export default function AccountPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [profile, setProfile] = useState<any>(null);
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAccount();
  }, []);

  async function loadAccount() {
    const { data: sessionData } = await supabase.auth.getSession();
    const user = sessionData.session?.user;

    if (!user) {
      router.replace("/account/login");
      return;
    }

    setEmail(user.email || "");

    const { data: profileData } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .maybeSingle();

    if (!profileData) {
      await supabase.from("profiles").upsert({
        id: user.id,
        email: user.email || "",
        username:
          user.user_metadata?.username ||
          (user.email ? user.email.split("@")[0] : "user"),
      });
    }

    const { data: listingData } = await supabase
      .from("listings")
      .select("*")
      .eq("seller_id", user.id)
      .order("created_at", { ascending: false });

    setProfile(
      profileData || {
        username:
          user.user_metadata?.username ||
          (user.email ? user.email.split("@")[0] : "user"),
      }
    );
    setListings(listingData || []);
    setLoading(false);
  }

  async function signOut() {
    await supabase.auth.signOut();
    router.push("/");
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#FAF8F2] p-10">Loading...</main>
    );
  }

  return (
    <main className="min-h-screen bg-[#FAF8F2] px-6 py-10 text-[#1F2933]">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <BrandLogo />
          <button
            onClick={signOut}
            className="rounded-xl bg-slate-900 px-4 py-2 font-semibold text-white"
          >
            Log Out
          </button>
        </div>

        <section className="mb-8 rounded-3xl bg-white p-6 shadow">
          <p className="mb-2 font-semibold text-[#D6A84F]">My Account</p>
          <h1 className="text-4xl font-bold">
            {profile?.username || email}
          </h1>
          <p className="mt-2 text-slate-600">{email}</p>
        </section>

        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <section className="rounded-3xl bg-white p-6 shadow">
            <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-2xl font-bold">Selling Progress</h2>
                <p className="text-slate-600">
                  Track listings you submitted for review.
                </p>
              </div>
              <Link
                href="/post-listing"
                className="rounded-xl bg-[#0B5D3B] px-4 py-2 text-center font-semibold text-white"
              >
                Post Listing
              </Link>
            </div>

            {listings.length === 0 ? (
              <div className="rounded-2xl bg-[#FAF8F2] p-5 text-slate-700">
                You have not submitted any listings yet.
              </div>
            ) : (
              <div className="space-y-4">
                {listings.map((listing) => (
                  <div key={listing.id} className="rounded-2xl border p-4">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <h3 className="text-lg font-bold">{listing.title}</h3>
                        <p className="text-slate-600">
                          {listing.city}, {listing.neighborhood}
                        </p>
                      </div>
                      <span className="rounded-full bg-[#FAF8F2] px-3 py-1 text-sm font-bold uppercase text-[#0B5D3B]">
                        {listing.status}
                      </span>
                    </div>
                    <div className="mt-4 grid gap-2 text-sm text-slate-600 md:grid-cols-3">
                      <p>Submitted</p>
                      <p>Admin review</p>
                      <p>Published when approved</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="rounded-3xl bg-[#0B5D3B] p-6 text-white shadow">
            <h2 className="text-2xl font-bold">Buying Progress</h2>
            <p className="mt-3 text-white/80">
              Use these steps when you are interested in a property.
            </p>

            <div className="mt-6 space-y-4">
              <div className="rounded-2xl bg-white/10 p-4">
                Search market value
              </div>
              <div className="rounded-2xl bg-white/10 p-4">
                Review verification documents
              </div>
              <div className="rounded-2xl bg-white/10 p-4">
                Contact seller and request confirmation
              </div>
              <div className="rounded-2xl bg-white/10 p-4">
                Report suspicious duplicate listings
              </div>
            </div>

            <Link
              href="/market"
              className="mt-6 block rounded-xl bg-white px-4 py-3 text-center font-semibold text-[#0B5D3B]"
            >
              Search Market Overview
            </Link>
          </section>
        </div>
      </div>
    </main>
  );
}
