import Image from "next/image";
import Link from "next/link";
import { site } from "@/data/site";

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-cream-200/10 bg-ink-800">
      <div className="pointer-events-none absolute inset-0 bg-ember-grain opacity-60" />
      <div className="container-luxe relative grid gap-12 py-16 md:grid-cols-[1.4fr_1fr_1fr_1.1fr] md:py-20">
        <div>
          <Image
            src={site.logo}
            alt="The Miners Arms crest"
            width={72}
            height={72}
            className="mb-4 h-16 w-16 rounded-full sm:h-[4.5rem] sm:w-[4.5rem]"
          />
          <p className="font-display text-2xl text-cream-50">The Miners Arms</p>
          <p className="mt-1 text-xs uppercase tracking-luxe text-saffron-500/80">
            Grill House · Est. 2015
          </p>
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-cream-200/60">
            A neighbourhood grill house in West Bromwich: English breakfasts,
            Indian curries and Chinese small plates, all under one roof.
          </p>
        </div>

        <div>
          <h3 className="text-xs font-semibold uppercase tracking-luxe text-cream-200/50">
            Explore
          </h3>
          <ul className="mt-5 space-y-3 text-sm">
            {[
              { href: "/about", label: "About" },
              { href: "/menu", label: "Menu" },
              { href: "/gallery", label: "Gallery" },
              { href: "/reservations", label: "Reservations" },
              { href: "/contact", label: "Contact" },
            ].map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="text-cream-200/70 transition-colors hover:text-saffron-400"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-xs font-semibold uppercase tracking-luxe text-cream-200/50">
            Find Us
          </h3>
          <address className="mt-5 space-y-3 text-sm not-italic text-cream-200/70">
            <p>
              {site.address.line1}
              <br />
              {site.address.line2}
              <br />
              {site.address.postcode}
            </p>
            <p>
              <a href={site.phoneHref} className="transition-colors hover:text-saffron-400">
                {site.phone}
              </a>
            </p>
          </address>
        </div>

        <div>
          <h3 className="text-xs font-semibold uppercase tracking-luxe text-cream-200/50">
            Hours
          </h3>
          <ul className="mt-5 space-y-2 text-sm text-cream-200/70">
            <li className="flex justify-between gap-3">
              <span>Mon–Thu</span>
              <span className="text-cream-200/50">3pm – 11pm</span>
            </li>
            <li className="flex justify-between gap-3">
              <span>Fri</span>
              <span className="text-cream-200/50">12pm – Late</span>
            </li>
            <li className="flex justify-between gap-3">
              <span>Sat</span>
              <span className="text-cream-200/50">12pm – Late</span>
            </li>
            <li className="flex justify-between gap-3">
              <span>Sun</span>
              <span className="text-cream-200/50">12pm – 11pm</span>
            </li>
            <li className="flex justify-between gap-3 pt-2 text-saffron-500/80">
              <span>Café</span>
              <span>Mon–Fri 7:30am–2pm</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="hairline" />
      <div className="container-luxe flex flex-col items-center justify-between gap-4 py-6 text-xs text-cream-200/50 sm:flex-row">
        <p>© {new Date().getFullYear()} The Miners Arms. All rights reserved.</p>
        <div className="flex items-center gap-5">
          <a href={site.social.instagram} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-saffron-400">
            Instagram
          </a>
          <a href={site.social.facebook} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-saffron-400">
            Facebook
          </a>
          <span className="hidden sm:inline">·</span>
          <a href="https://crownbot.uk" target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-saffron-400">Designed by CROWNBOT</a>
        </div>
      </div>
    </footer>
  );
}
