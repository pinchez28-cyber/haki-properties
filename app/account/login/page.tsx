"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import BrandLogo from "@/components/BrandLogo";
import { supabase } from "@/lib/supabase";

export default function AccountLoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setMessage("");

    if (mode === "signup") {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
          },
        },
      });

      if (error) {
        setMessage(error.message);
        setIsLoading(false);
        return;
      }

      if (data.user && data.session) {
        await supabase.from("profiles").upsert({
          id: data.user.id,
          email,
          username,
        });
      }

      if (data.session) {
        setMessage("Account created. You can now view your progress.");
        router.push("/account");
      } else {
        setMessage("Account created. Check your email to confirm your login.");
        setIsLoading(false);
      }
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMessage(error.message);
      setIsLoading(false);
      return;
    }

    router.push("/account");
  }

  return (
    <main className="min-h-screen bg-[#FAF8F2] px-6 py-10 text-[#1F2933]">
      <div className="mx-auto max-w-md">
        <div className="mb-8">
          <BrandLogo href="/" />
        </div>

        <form onSubmit={handleSubmit} className="rounded-3xl bg-white p-8 shadow-xl">
          <p className="mb-3 font-semibold text-[#D6A84F]">
            {mode === "login" ? "Welcome back" : "Create your account"}
          </p>
          <h1 className="mb-6 text-3xl font-bold">
            {mode === "login" ? "Log in" : "Sign up"}
          </h1>

          <div className="mb-6 grid grid-cols-2 rounded-xl bg-[#FAF8F2] p-1">
            <button
              type="button"
              onClick={() => setMode("login")}
              className={`rounded-lg px-3 py-2 font-semibold ${
                mode === "login" ? "bg-white shadow-sm" : ""
              }`}
            >
              Log In
            </button>
            <button
              type="button"
              onClick={() => setMode("signup")}
              className={`rounded-lg px-3 py-2 font-semibold ${
                mode === "signup" ? "bg-white shadow-sm" : ""
              }`}
            >
              Sign Up
            </button>
          </div>

          {message && (
            <p className="mb-5 rounded-xl bg-green-50 p-3 text-sm font-semibold text-green-700">
              {message}
            </p>
          )}

          {mode === "signup" && (
            <>
              <label className="mb-2 block font-semibold">Username</label>
              <input
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                className="mb-5 w-full rounded-xl border p-3"
                placeholder="yourname"
                required
              />
            </>
          )}

          <label className="mb-2 block font-semibold">Email</label>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="mb-5 w-full rounded-xl border p-3"
            placeholder="you@example.com"
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
            {isLoading
              ? "Please wait..."
              : mode === "login"
                ? "Log In"
                : "Create Account"}
          </button>
        </form>
      </div>
    </main>
  );
}
