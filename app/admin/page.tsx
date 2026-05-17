"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import BrandLogo from "@/components/BrandLogo";
import { supabase } from "@/lib/supabase";

type AdminUser = {
  id: string;
  email: string;
  role: string;
  created_at: string;
};

export default function AdminPage() {
  const router = useRouter();
  const [listings, setListings] = useState<any[]>([]);
  const [allListings, setAllListings] = useState<any[]>([]);
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [currentAdmin, setCurrentAdmin] = useState<AdminUser | null>(null);
  const [currentEmail, setCurrentEmail] = useState("");
  const [newAdminEmail, setNewAdminEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAdminDashboard();
  }, []);

  async function loadAdminDashboard() {
    setLoading(true);
    setMessage("");

    const { data: sessionData } = await supabase.auth.getSession();
    const user = sessionData.session?.user;
    const email = user?.email;

    if (!email) {
      router.replace("/admin/login");
      return;
    }

    setCurrentEmail(email);

    const { data: isAdmin, error: adminError } =
      await supabase.rpc("is_haki_admin");

    if (adminError || !isAdmin) {
      setCurrentAdmin(null);
      setLoading(false);
      return;
    }

    setCurrentAdmin({
      id: user.id,
      email,
      role: "admin",
      created_at: new Date().toISOString(),
    });
    await fetchListings();
    await fetchAdmins();
    setLoading(false);
  }

  async function fetchListings() {
    const { data, error } = await supabase
      .from("listings")
      .select("*")
      .eq("status", "pending")
      .order("created_at", { ascending: false });

    const { data: allData } = await supabase
      .from("listings")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setListings(data);
    }

    if (allData) {
      setAllListings(allData);
    }
  }

  async function fetchAdmins() {
    const { data } = await supabase
      .from("admin_users")
      .select("*")
      .order("created_at", { ascending: false });

    setAdmins((data || []) as AdminUser[]);
  }

  async function addAdmin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");

    const email = newAdminEmail.trim().toLowerCase();

    if (!email) {
      return;
    }

    const { error } = await supabase
      .from("admin_users")
      .insert({ email, role: "admin" });

    if (error) {
      setMessage(error.message);
      return;
    }

    setNewAdminEmail("");
    setMessage(`${email} was added as an admin.`);
    await fetchAdmins();
  }

  async function signOut() {
    await supabase.auth.signOut();
    router.push("/admin/login");
  }

  async function approveListing(id: string) {
    const { error } = await supabase
      .from("listings")
      .update({ status: "active" })
      .eq("id", id);

    if (!error) {
      setListings((prev) => prev.filter((listing) => listing.id !== id));
    }
  }

  function normalize(value: string | null | undefined) {
    return String(value || "").trim().toLowerCase();
  }

  function getDuplicateWarnings(listing: any) {
    const identifier = normalize(listing.property_identifier);
    const city = normalize(listing.city);
    const neighborhood = normalize(listing.neighborhood);
    const propertyType = normalize(listing.property_type);

    return allListings.filter((candidate) => {
      if (candidate.id === listing.id) {
        return false;
      }

      const candidateIdentifier = normalize(candidate.property_identifier);

      if (identifier && candidateIdentifier === identifier) {
        return true;
      }

      return (
        city &&
        propertyType &&
        normalize(candidate.city) === city &&
        normalize(candidate.neighborhood) === neighborhood &&
        normalize(candidate.property_type) === propertyType
      );
    });
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f5f3ee] p-10">Loading...</main>
    );
  }

  if (!currentAdmin) {
    return (
      <main className="min-h-screen bg-[#f5f3ee] p-10">
        <div className="mx-auto max-w-2xl rounded-3xl bg-white p-8 shadow-xl">
          <BrandLogo />
          <h1 className="mt-8 text-3xl font-bold">Admin access required</h1>
          <p className="mt-3 text-slate-600">
            You are logged in as {currentEmail}, but this email has not been
            added as a Haki Marketplace admin.
          </p>
          <button
            onClick={signOut}
            className="mt-6 rounded-xl bg-[#0B5D3B] px-5 py-3 font-semibold text-white"
          >
            Log Out
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f5f3ee] p-10">
      <div className="max-w-5xl mx-auto">
        <div className="mb-10 flex flex-col gap-5 border-b border-slate-200 pb-6 md:flex-row md:items-center md:justify-between">
          <BrandLogo href="/admin" label="Haki Admin" />

          <div className="flex flex-wrap gap-3">
            <a
              href="/"
              className="rounded-xl border border-slate-300 px-4 py-2 text-center font-semibold text-slate-700 hover:bg-white"
            >
              View Public Site
            </a>
            <button
              onClick={signOut}
              className="rounded-xl bg-slate-900 px-4 py-2 font-semibold text-white"
            >
              Log Out
            </button>
          </div>
        </div>

        <h1 className="text-5xl font-bold text-slate-900 mb-3">
          Administration Review
        </h1>

        <p className="text-slate-600 mb-10">
          Review pending property listings before they go live. Logged in as{" "}
          <strong>{currentEmail}</strong>.
        </p>

        <section className="mb-10 rounded-3xl bg-white p-6 shadow">
          <div className="mb-5 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-2xl font-bold">Admin Users</h2>
              <p className="text-slate-600">
                Add the email address of someone you want to approve listings.
              </p>
            </div>
          </div>

          {message && (
            <p className="mb-5 rounded-xl bg-green-50 p-3 font-semibold text-green-700">
              {message}
            </p>
          )}

          <form onSubmit={addAdmin} className="mb-6 flex flex-col gap-3 md:flex-row">
            <input
              type="email"
              value={newAdminEmail}
              onChange={(event) => setNewAdminEmail(event.target.value)}
              className="flex-1 rounded-xl border p-3"
              placeholder="new-admin@example.com"
              required
            />
            <button className="rounded-xl bg-[#0B5D3B] px-5 py-3 font-semibold text-white">
              Add Admin
            </button>
          </form>

          <div className="grid gap-3 md:grid-cols-2">
            {admins.map((admin) => (
              <div key={admin.id} className="rounded-2xl bg-slate-50 p-4">
                <p className="font-bold">{admin.email}</p>
                <p className="text-sm uppercase tracking-wide text-slate-500">
                  {admin.role}
                </p>
              </div>
            ))}
          </div>
        </section>

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
              <ListingReviewCard
                listing={listing}
                duplicateWarnings={getDuplicateWarnings(listing)}
                approveListing={approveListing}
              />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

function ListingReviewCard({
  listing,
  duplicateWarnings,
  approveListing,
}: {
  listing: any;
  duplicateWarnings: any[];
  approveListing: (id: string) => void;
}) {
  return (
    <>
      {listing.image_url && (
        <img
          src={listing.image_url}
          alt={listing.title}
          className="w-full h-72 object-cover"
        />
      )}

      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">{listing.title}</h2>

          <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
            Pending
          </span>
        </div>

        {duplicateWarnings.length > 0 && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-800">
            <h3 className="mb-2 font-bold">Possible duplicate property</h3>
            <p className="mb-3 text-sm">
              Review carefully before approval. Similar listings or matching
              property references already exist.
            </p>

            <div className="space-y-2">
              {duplicateWarnings.slice(0, 3).map((duplicate) => (
                <div key={duplicate.id} className="rounded-xl bg-white p-3">
                  <p className="font-semibold">{duplicate.title}</p>
                  <p className="text-sm">
                    {duplicate.city}, {duplicate.neighborhood} -{" "}
                    {duplicate.status}
                  </p>
                  {duplicate.property_identifier && (
                    <p className="text-sm">
                      Ref: {duplicate.property_identifier}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

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
            <strong>Price:</strong> ${Number(listing.price).toLocaleString()}
          </p>

          <p>
            <strong>Property Ref:</strong>{" "}
            {listing.property_identifier || "Not provided"}
          </p>
        </div>

        <p className="text-slate-600 leading-7 mb-6">{listing.description}</p>

        {Array.isArray(listing.document_urls) &&
          listing.document_urls.length > 0 && (
            <div className="mb-6 rounded-2xl bg-slate-50 p-4">
              <h3 className="mb-3 text-lg font-bold">Submitted Documents</h3>

              <div className="grid gap-3 sm:grid-cols-2">
                {listing.document_urls.map((url: string, index: number) => (
                  <a
                    key={url}
                    href={url}
                    target="_blank"
                    className="overflow-hidden rounded-xl border bg-white"
                  >
                    <img
                      src={url}
                      alt={`Submitted document ${index + 1}`}
                      className="h-44 w-full object-cover"
                    />
                  </a>
                ))}
              </div>
            </div>
          )}

        <button
          onClick={() => approveListing(listing.id)}
          className="bg-green-700 hover:bg-green-800 text-white px-6 py-3 rounded-xl font-semibold transition"
        >
          Approve Listing
        </button>
      </div>
    </>
  );
}
