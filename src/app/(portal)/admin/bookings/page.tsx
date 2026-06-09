"use client";

import { useEffect, useState, useCallback } from "react";
import type { Booking, BookingStatus } from "@/lib/store";

const STATUS_OPTIONS: BookingStatus[] = ["pending", "confirmed", "cancelled"];

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

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [filter, setFilter] = useState<BookingStatus | "all">("all");

  const load = useCallback(async () => {
    const res = await fetch("/api/bookings");
    if (res.ok) {
      const data: Booking[] = await res.json();
      setBookings(data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    }
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  async function updateStatus(id: string, status: BookingStatus) {
    setUpdating(id);
    await fetch(`/api/bookings/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    await load();
    setUpdating(null);
  }

  async function deleteBooking(id: string) {
    if (!confirm("Delete this booking?")) return;
    setUpdating(id);
    await fetch(`/api/bookings/${id}`, { method: "DELETE" });
    await load();
    setUpdating(null);
  }

  const filtered = filter === "all" ? bookings : bookings.filter((b) => b.status === filter);
  const counts = { all: bookings.length, pending: 0, confirmed: 0, cancelled: 0 };
  for (const b of bookings) counts[b.status]++;

  return (
    <div className="pt-14 lg:pt-0 max-w-6xl">
      <div className="mb-6">
        <h1 className="font-display text-3xl text-cream-50">Bookings</h1>
        <p className="mt-1 text-sm text-cream-200/50">Manage table reservations</p>
      </div>

      {/* Filter tabs */}
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
            <div key={b.id} className={`card-surface p-4 transition-opacity ${updating === b.id ? "opacity-50" : ""}`}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-display text-base text-cream-50">{b.name}</span>
                    <StatusBadge status={b.status} />
                  </div>
                  <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-xs text-cream-200/50">
                    <span>📅 {b.date} at {b.time}</span>
                    <span>👥 {b.guests} {b.guests === 1 ? "guest" : "guests"}</span>
                    <span>📞 {b.phone}</span>
                    <span>✉️ {b.email}</span>
                  </div>
                  {b.notes && (
                    <p className="mt-2 rounded-lg bg-ink-700/40 px-3 py-1.5 text-xs text-cream-200/60">
                      Note: {b.notes}
                    </p>
                  )}
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <select
                    value={b.status}
                    onChange={(e) => updateStatus(b.id, e.target.value as BookingStatus)}
                    disabled={updating === b.id}
                    className="rounded-lg border border-cream-200/10 bg-ink-800 px-3 py-1.5 text-xs text-cream-100 outline-none focus:border-saffron-500/40"
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                  <button
                    onClick={() => deleteBooking(b.id)}
                    disabled={updating === b.id}
                    className="rounded-lg border border-ember-500/20 bg-ember-500/10 px-3 py-1.5 text-xs text-ember-400 transition-colors hover:bg-ember-500/20 disabled:opacity-50"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
