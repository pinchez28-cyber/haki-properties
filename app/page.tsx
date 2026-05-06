import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#FAF8F2] text-[#1F2933]">
      
      {/* NAVBAR */}
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
        <div className="text-2xl font-bold text-[#0B5D3B]">
          Haki Properties
        </div>

        <div className="hidden gap-6 md:flex">
          <Link href="/listings">Buy</Link>
          <Link href="/listings">Rent</Link>
          <Link href="/listings">Land</Link>

          <Link
            href="/post-listing"
            className="rounded-xl bg-[#0B5D3B] px-4 py-2 text-white"
          >
            Post Listing
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <section className="mx-auto grid max-w-7xl gap-10 px-6 py-16 md:grid-cols-2 md:items-center">
        <div>
          <p className="mb-3 font-semibold text-[#D6A84F]">
            Verified homes. Trusted deals.
          </p>

          <h1 className="mb-6 text-4xl font-bold leading-tight md:text-6xl">
  Find verified homes, land, and real estate across East Africa
</h1>

          <p className="mb-8 text-lg text-gray-700">
            Avoid scams. Browse verified listings with trusted sellers and
            secure messaging.
          </p>

          <div className="rounded-2xl bg-white p-4 shadow-lg">
            <div className="grid gap-3 md:grid-cols-4">
              <input
                className="rounded-xl border p-3"
                placeholder="City"
              />

              <select className="rounded-xl border p-3">
                <option>Rent</option>
                <option>Buy</option>
                <option>Land</option>
              </select>

              <input
                className="rounded-xl border p-3"
                placeholder="Max price"
              />

              <Link
                href="/listings"
                className="rounded-xl bg-[#0B5D3B] p-3 text-center font-semibold text-white"
              >
                Search
              </Link>
            </div>
          </div>
        </div>

        {/* TRUST BOX */}
        <div className="rounded-3xl bg-[#0B5D3B] p-8 text-white shadow-xl">
          <h2 className="mb-4 text-2xl font-bold">
            Built for safer property deals
          </h2>

          <ul className="space-y-4 text-lg">
            <li>✅ Verified seller profiles</li>
            <li>✅ Document checks</li>
            <li>✅ Scam reporting</li>
            <li>✅ Secure messaging</li>
          </ul>
        </div>
      </section>

    </main>
  );
}