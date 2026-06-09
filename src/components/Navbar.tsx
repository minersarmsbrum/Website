"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { site } from "@/data/site";

const links = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/menu", label: "Menu" },
  { href: "/gallery", label: "Gallery" },
  { href: "/contact", label: "Contact" },
];

type SessionInfo = { role: "admin" | "staff" | null; username: string | null };

async function logout() {
  await fetch("/api/auth/logout", { method: "POST" });
  window.location.href = "/";
}

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [session, setSession] = useState<SessionInfo>({ role: null, username: null });

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((data: SessionInfo) => setSession(data))
      .catch(() => {});
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const portalHref = session.role === "admin" ? "/admin" : "/staff";
  const portalLabel = session.role === "admin" ? "Admin Portal" : "Staff Portal";

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 1.6 }}
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "border-b border-cream-200/10 bg-ink-900/85 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <nav className="container-luxe flex h-20 items-center justify-between">
        <Link href="/" className="group flex items-center gap-3 leading-none">
          <Image
            src={site.logo}
            alt="The Miners Arms crest"
            width={56}
            height={56}
            priority
            className="h-12 w-12 rounded-full sm:h-14 sm:w-14"
          />
          <span className="flex flex-col">
            <span className="font-display text-xl text-cream-50 sm:text-2xl">
              The Miners Arms
            </span>
            <span className="text-[0.6rem] uppercase tracking-luxe text-saffron-500/80">
              Grill House · West Bromwich
            </span>
          </span>
        </Link>

        <div className="hidden items-center gap-8 lg:flex">
          {links.map((l) => {
            const active = pathname === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`relative text-sm font-medium tracking-wide transition-colors ${
                  active ? "text-saffron-400" : "text-cream-100/80 hover:text-cream-50"
                }`}
              >
                {l.label}
                {active && (
                  <motion.span
                    layoutId="nav-underline"
                    className="absolute -bottom-1.5 left-0 h-px w-full bg-saffron-400"
                  />
                )}
              </Link>
            );
          })}
          <Link href="/reservations" className="btn-gold !px-6 !py-2.5">
            Book a Table
          </Link>

          {/* Staff / Admin access */}
          {session.role ? (
            <div className="flex items-center gap-3 border-l border-cream-200/10 pl-6">
              <Link
                href={portalHref}
                className="text-sm font-medium text-saffron-400/80 hover:text-saffron-400 transition-colors"
              >
                {portalLabel}
              </Link>
              <button
                onClick={logout}
                aria-label="Sign out"
                title="Sign out"
                className="flex h-7 w-7 items-center justify-center rounded-full border border-cream-200/15 text-cream-200/40 hover:border-cream-200/40 hover:text-cream-200/80 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5">
                  <path fillRule="evenodd" d="M3 4.25A2.25 2.25 0 0 1 5.25 2h5.5A2.25 2.25 0 0 1 13 4.25v2a.75.75 0 0 1-1.5 0v-2a.75.75 0 0 0-.75-.75h-5.5a.75.75 0 0 0-.75.75v11.5c0 .414.336.75.75.75h5.5a.75.75 0 0 0 .75-.75v-2a.75.75 0 0 1 1.5 0v2A2.25 2.25 0 0 1 10.75 18h-5.5A2.25 2.25 0 0 1 3 15.75V4.25Z" clipRule="evenodd" />
                  <path fillRule="evenodd" d="M19 10a.75.75 0 0 0-.75-.75H8.704l1.048-1.05a.75.75 0 1 0-1.06-1.06l-2.25 2.25a.75.75 0 0 0 0 1.06l2.25 2.25a.75.75 0 1 0 1.06-1.06l-1.048-1.05H18.25A.75.75 0 0 0 19 10Z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-1.5 border-l border-cream-200/10 pl-6 text-xs font-medium uppercase tracking-wider text-cream-200/40 hover:text-cream-200/70 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-3 w-3">
                <path fillRule="evenodd" d="M8 1a3.5 3.5 0 1 1 0 7 3.5 3.5 0 0 1 0-7ZM4.5 8A3.5 3.5 0 0 0 1 11.5V13a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-1.5A3.5 3.5 0 0 0 11.5 8h-7Z" clipRule="evenodd" />
              </svg>
              Staff Login
            </Link>
          )}
        </div>

        <button
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
          aria-expanded={open}
          className="relative z-50 flex h-10 w-10 items-center justify-center lg:hidden"
        >
          <div className="flex flex-col gap-1.5">
            <span
              className={`block h-0.5 w-6 bg-cream-50 transition-transform duration-300 ${
                open ? "translate-y-2 rotate-45" : ""
              }`}
            />
            <span
              className={`block h-0.5 w-6 bg-cream-50 transition-opacity duration-300 ${
                open ? "opacity-0" : ""
              }`}
            />
            <span
              className={`block h-0.5 w-6 bg-cream-50 transition-transform duration-300 ${
                open ? "-translate-y-2 -rotate-45" : ""
              }`}
            />
          </div>
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-t border-cream-200/10 bg-ink-900/95 backdrop-blur-xl lg:hidden"
          >
            <div className="container-luxe flex flex-col gap-1 py-6">
              {links.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className={`rounded-lg px-4 py-3 text-lg font-medium transition-colors ${
                    pathname === l.href
                      ? "bg-ink-700 text-saffron-400"
                      : "text-cream-100/80 hover:bg-ink-700"
                  }`}
                >
                  {l.label}
                </Link>
              ))}
              <Link href="/reservations" className="btn-gold mt-3">
                Book a Table
              </Link>
              <a href={site.phoneHref} className="btn-ghost mt-2">
                Call {site.phone}
              </a>

              {/* Staff / Admin access — mobile */}
              <div className="mt-4 border-t border-cream-200/10 pt-4">
                {session.role ? (
                  <div className="flex items-center justify-between px-1">
                    <Link
                      href={portalHref}
                      className="text-sm font-medium text-saffron-400/80"
                    >
                      {portalLabel}
                    </Link>
                    <button
                      onClick={logout}
                      className="text-xs text-cream-200/40 hover:text-cream-200/70 transition-colors"
                    >
                      Sign out
                    </button>
                  </div>
                ) : (
                  <Link
                    href="/login"
                    className="flex items-center gap-2 px-1 text-xs font-medium uppercase tracking-wider text-cream-200/40"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-3 w-3">
                      <path fillRule="evenodd" d="M8 1a3.5 3.5 0 1 1 0 7 3.5 3.5 0 0 1 0-7ZM4.5 8A3.5 3.5 0 0 0 1 11.5V13a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-1.5A3.5 3.5 0 0 0 11.5 8h-7Z" clipRule="evenodd" />
                    </svg>
                    Staff Login
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
