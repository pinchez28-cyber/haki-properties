import Link from "next/link";
import BrandLogo from "@/components/BrandLogo";
import ShareButton from "@/components/ShareButton";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#FAF8F2] text-[#1F2933]">
      <nav className="mx-auto flex max-w-7xl flex-col items-center justify-between px-6 py-5 md:flex-row">
        <BrandLogo />

        <div className="mt-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 md:mt-0">
          <Link href="/listings">Buy</Link>
          <Link href="/listings">Rent</Link>
          <Link href="/listings">Land</Link>
          <Link href="/market">Market Overview</Link>
          <Link href="/account">My Account</Link>
          <ShareButton />

          <Link
            href="/post-listing"
            className="rounded-xl bg-[#0B5D3B] px-4 py-2 font-semibold text-white"
          >
            Post Listing
          </Link>
        </div>
      </nav>

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
            secure messaging. Compare market values before you buy, rent, or
            list.
          </p>

          <form action="/market" className="rounded-2xl bg-white p-4 shadow-lg">
            <div className="grid gap-3 md:grid-cols-4">
              <input
                name="city"
                className="rounded-xl border p-3"
                placeholder="City"
              />

              <select name="listing_type" className="rounded-xl border p-3">
                <option value="rent">Rent</option>
                <option value="sale">Buy</option>
                <option value="">Any</option>
              </select>

              <input
                name="max_price"
                className="rounded-xl border p-3"
                placeholder="Max price"
              />

              <button
                className="rounded-xl bg-[#0B5D3B] p-3 text-center font-semibold text-white"
              >
                Search Market
              </button>
            </div>
          </form>
        </div>

        <div className="overflow-hidden rounded-3xl bg-white shadow-xl">
          <img
            src="/images/homes-and-land-showcase.png"
            alt="Modern homes beside open land plots"
            className="h-72 w-full object-cover md:h-96"
          />

          <div className="bg-[#0B5D3B] p-8 text-white">
            <h2 className="mb-4 text-2xl font-bold">
              Built for safer property deals
            </h2>

            <ul className="space-y-4 text-lg">
              <li>Verified seller profiles</li>
              <li>Document checks</li>
              <li>Scam reporting</li>
              <li>Secure messaging</li>
            </ul>
          </div>
        </div>
      </section>
    </main>
  );
}
