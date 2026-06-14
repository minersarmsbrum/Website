import { db } from "@/lib/db";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const [bookings, gallery, menu] = await Promise.all([
    db.bookings.list(),
    db.gallery.list(),
    db.menu.load(),
  ]);

  const pending = bookings.filter((b) => b.status === "pending").length;
  const confirmed = bookings.filter((b) => b.status === "confirmed").length;
  const totalCategories = menu.reduce((n, s) => n + s.categories.length, 0);

  const stats = [
    { label: "Total Bookings", value: bookings.length, href: "/admin/bookings", color: "text-saffron-400" },
    { label: "Pending Bookings", value: pending, href: "/admin/bookings", color: "text-amber-400" },
    { label: "Confirmed Bookings", value: confirmed, href: "/admin/bookings", color: "text-jade-400" },
    { label: "Gallery Photos", value: gallery.length, href: "/admin/gallery", color: "text-saffron-400" },
    { label: "Menu Categories", value: totalCategories, href: "/admin/menu", color: "text-saffron-400" },
  ];

  const recent = [...bookings]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return (
    <div className="lg:pt-0 pt-14 max-w-5xl">
      <div className="mb-8">
        <h1 className="font-display text-3xl text-cream-50">Dashboard</h1>
        <p className="mt-1 text-sm text-cream-200/50">Overview of The Miners Arms portal</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {stats.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className="card-surface p-5 transition-colors hover:border-saffron-500/30"
          >
            <p className={`font-display text-3xl font-bold ${s.color}`}>{s.value}</p>
            <p className="mt-1 text-xs text-cream-200/50">{s.label}</p>
          </Link>
        ))}
      </div>

      {/* Recent bookings */}
      <div className="mt-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-lg text-cream-50">Recent Bookings</h2>
          <Link href="/admin/bookings" className="text-xs text-saffron-400 hover:underline">
            View all →
          </Link>
        </div>
        <div className="card-surface overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-cream-200/10">
                <th className="px-4 py-3 text-left text-xs uppercase tracking-wider text-cream-200/40">Guest</th>
                <th className="hidden px-4 py-3 text-left text-xs uppercase tracking-wider text-cream-200/40 sm:table-cell">Date</th>
                <th className="hidden px-4 py-3 text-left text-xs uppercase tracking-wider text-cream-200/40 md:table-cell">Guests</th>
                <th className="px-4 py-3 text-left text-xs uppercase tracking-wider text-cream-200/40">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cream-200/5">
              {recent.map((b) => (
                <tr key={b.id} className="hover:bg-ink-700/30">
                  <td className="px-4 py-3 text-cream-100">{b.name}</td>
                  <td className="hidden px-4 py-3 text-cream-200/60 sm:table-cell">{b.date} {b.time}</td>
                  <td className="hidden px-4 py-3 text-cream-200/60 md:table-cell">{b.guests}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={b.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick links */}
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {[
          { href: "/admin/bookings", label: "Manage Bookings", desc: "Update status, delete entries" },
          { href: "/admin/gallery", label: "Manage Gallery", desc: "Upload & remove photos" },
          { href: "/admin/menu", label: "Manage Menu", desc: "Edit categories, items & prices" },
        ].map((l) => (
          <Link key={l.href} href={l.href} className="card-surface p-5 transition-colors hover:border-saffron-500/30">
            <p className="font-display text-base text-cream-50">{l.label}</p>
            <p className="mt-1 text-xs text-cream-200/45">{l.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const cls =
    status === "confirmed" ? "bg-jade-500/15 text-jade-400" :
    status === "cancelled" ? "bg-ember-500/15 text-ember-400" :
    "bg-saffron-500/15 text-saffron-400";
  return (
    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${cls}`}>
      {status}
    </span>
  );
}
