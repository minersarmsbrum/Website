"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { site } from "@/data/site";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username.trim(), password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Invalid credentials");
        return;
      }

      router.push(data.role === "admin" ? "/admin" : "/staff");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-ink-900 px-4">
      {/* Background glow */}
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_at_center,rgba(201,162,39,0.06)_0%,transparent_70%)]" />

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center gap-3 text-center">
          <Image
            src={site.logo}
            alt="The Miners Arms crest"
            width={72}
            height={72}
            className="rounded-full"
          />
          <div>
            <p className="font-display text-2xl text-cream-50">{site.name}</p>
            <p className="text-xs uppercase tracking-luxe text-saffron-500/80">Staff Portal</p>
          </div>
        </div>

        {/* Card */}
        <div className="card-surface p-8">
          <h1 className="mb-1 font-display text-xl text-cream-50">Sign in</h1>
          <p className="mb-6 text-sm text-cream-200/50">Enter your credentials to access the portal.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-cream-200/50">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                required
                className={`w-full rounded-xl border bg-ink-800/80 px-4 py-3 text-sm text-cream-50 outline-none transition-colors placeholder:text-cream-200/20 focus:border-saffron-500/60 focus:ring-1 focus:ring-saffron-500/30 ${
                  error ? "border-ember-500/60" : "border-cream-200/10"
                }`}
                placeholder="your username"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-cream-200/50">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
                className={`w-full rounded-xl border bg-ink-800/80 px-4 py-3 text-sm text-cream-50 outline-none transition-colors placeholder:text-cream-200/20 focus:border-saffron-500/60 focus:ring-1 focus:ring-saffron-500/30 ${
                  error ? "border-ember-500/60" : "border-cream-200/10"
                }`}
                placeholder="••••••••"
              />
            </div>

            {error && (
              <p className="rounded-lg border border-ember-500/20 bg-ember-500/10 px-4 py-2.5 text-sm text-ember-400">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-gold w-full disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-xs text-cream-200/25">
          © {new Date().getFullYear()} {site.name}. Authorised access only.
        </p>
      </div>
    </div>
  );
}
