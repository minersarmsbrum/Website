"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { site } from "@/data/site";

const navLinks = [
  { href: "/staff", label: "Overview", icon: "▦" },
  { href: "/staff/bookings", label: "Bookings", icon: "📅" },
];

export function StaffSidebar({ username, role }: { username: string; role: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  async function handleLogout() {
    setLoggingOut(true);
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
  }

  const sidebarContent = (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-3 border-b border-cream-200/10 px-5 py-5">
        <Image src={site.logo} alt="logo" width={40} height={40} className="rounded-full" />
        <div className="min-w-0">
          <p className="truncate font-display text-sm text-cream-50">The Miners Arms</p>
          <p className="text-[10px] uppercase tracking-luxe text-saffron-500/70">Staff Portal</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {navLinks.map((l) => {
          const active = pathname === l.href;
          return (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                active
                  ? "bg-saffron-500/15 text-saffron-400"
                  : "text-cream-200/60 hover:bg-ink-700/60 hover:text-cream-100"
              }`}
            >
              <span className="text-base">{l.icon}</span>
              {l.label}
              {active && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-saffron-500" />}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-cream-200/10 px-5 py-4">
        <p className="mb-1 truncate text-xs text-cream-200/40">Signed in as <span className="text-cream-200/70">{username}</span></p>
        <p className="mb-3 text-xs capitalize text-saffron-500/60">{role}</p>
        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className="btn-ghost w-full !py-2 text-xs disabled:opacity-50"
        >
          {loggingOut ? "Signing out…" : "Sign out"}
        </button>
      </div>
    </div>
  );

  return (
    <>
      <aside className="hidden w-56 shrink-0 border-r border-cream-200/10 bg-ink-800/80 backdrop-blur lg:block">
        {sidebarContent}
      </aside>

      <div className="fixed inset-x-0 top-0 z-40 flex h-14 items-center justify-between border-b border-cream-200/10 bg-ink-900/95 px-4 backdrop-blur lg:hidden">
        <div className="flex items-center gap-2.5">
          <Image src={site.logo} alt="logo" width={32} height={32} className="rounded-full" />
          <span className="font-display text-sm text-cream-50">Staff</span>
        </div>
        <button
          onClick={() => setMobileOpen((v) => !v)}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-cream-200/10 text-cream-200/60"
        >
          {mobileOpen ? "✕" : "☰"}
        </button>
      </div>

      {mobileOpen && (
        <div className="fixed inset-0 z-30 lg:hidden">
          <div className="absolute inset-0 bg-ink-900/80" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-14 bottom-0 w-56 border-r border-cream-200/10 bg-ink-800">
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
}
