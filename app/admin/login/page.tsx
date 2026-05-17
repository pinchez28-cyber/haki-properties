"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import BrandLogo from "@/components/BrandLogo";
import { supabase } from "@/lib/supabase";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setMessage("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMessage(error.message);
      setIsLoading(false);
      return;
    }

    router.push("/admin");
  }

  return (
    <main className="min-h-screen bg-[#FAF8F2] px-6 py-10 text-[#1F2933]">
      <div className="mx-auto max-w-md">
        <div className="mb-8">
          <BrandLogo href="/" />
        </div>

        <form onSubmit={handleLogin} className="rounded-3xl bg-white p-8 shadow-xl">
          <p className="mb-3 font-semibold text-[#D6A84F]">Admin access</p>
          <h1 className="mb-6 text-3xl font-bold">Log in to review listings</h1>

          {message && (
            <p className="mb-5 rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-700">
              {message}
            </p>
          )}

          <label className="mb-2 block font-semibold">Email</label>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="mb-5 w-full rounded-xl border p-3"
            placeholder="admin@example.com"
            required
          />

          <label className="mb-2 block font-semibold">Password</label>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="mb-6 w-full rounded-xl border p-3"
            placeholder="Password"
            required
          />

          <button
            disabled={isLoading}
            className="w-full rounded-xl bg-[#0B5D3B] p-4 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? "Logging in..." : "Log In"}
          </button>
        </form>
      </div>
    </main>
  );
}
