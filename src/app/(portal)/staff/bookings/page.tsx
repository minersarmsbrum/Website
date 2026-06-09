"use client";

import { useEffect, useState } from "react";
import type { Booking, BookingStatus } from "@/lib/store";

function StatusBadge({ status }: { status: BookingStatus }) {
  const cls =
    status === "confirmed" ? "bg-jade-500/15 text-jade-400 border-jade-500/20" :
    status === "cancelled" ? "bg-ember-500/15 text-ember-400 border-ember-500/20" :
    "bg-saffron-500/15 text-saffron-400 border-saffron-500/20";
  return (
    <span className={`rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize ${cls}`}>
      {status}
    </span>
  );
}

export default function StaffBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<BookingStatus | "all">("all");

  useEffect(() => {
    fetch("/api/bookings")
      .then((r) => r.json())
      .then((data: Booking[]) => {
        setBookings(data.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
      })
      .finally(() => setLoading(false));
  }, []);

  const filtered = filter === "all" ? bookings : bookings.filter((b) => b.status === filter);
  const counts = { all: bookings.length, pending: 0, confirmed: 0, cancelled: 0 };
  for (const b of bookings) counts[b.status]++;

  return (
    <div className="pt-14 lg:pt-0 max-w-4xl">
      <div className="mb-6">
        <h1 className="font-display text-3xl text-cream-50">Bookings</h1>
        <p className="mt-1 text-sm text-cream-200/50">Read-only view of all table reservations</p>
      </div>

      <div className="mb-5 flex flex-wrap gap-2">
        {(["all", "pending", "confirmed", "cancelled"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-full px-4 py-1.5 text-xs font-medium capitalize transition-colors ${
              filter === f
                ? "bg-saffron-500 text-ink-900"
                : "border border-cream-200/10 text-cream-200/60 hover:border-saffron-500/30 hover:text-cream-100"
            }`}
          >
            {f} ({counts[f]})
          </button>
        ))}
      </div>

      {loading ? (
        <div className="card-surface p-8 text-center text-cream-200/40">Loading bookings…</div>
      ) : filtered.length === 0 ? (
        <div className="card-surface p-8 text-center text-cream-200/40">No bookings found.</div>
      ) : (
        <div className="space-y-3">
          {filtered.map((b) => (
            <div key={b.id} className="card-surface p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-display text-base text-cream-50">{b.name}</span>
                    <StatusBadge status={b.status} />
                  </div>
                  <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-xs text-cream-200/50">
                    <span>📅 {b.date} at {b.time}</span>
                    <span>👥 {b.guests} {b.guests === 1 ? "guest" : "guests"}</span>
                    <span>📞 {b.phone}</span>
                  </div>
                  {b.notes && (
                    <p className="mt-2 rounded-lg bg-ink-700/40 px-3 py-1.5 text-xs text-cream-200/60">
                      Note: {b.notes}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
