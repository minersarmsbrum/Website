"use client";

import { useEffect, useState, useCallback } from "react";
import type { Booking, BookingStatus } from "@/lib/store";

const TIME_SLOTS = ["12:00","12:30","13:00","13:30","17:00","17:30","18:00","18:30","19:00","19:30","20:00","20:30","21:00"];
const EMPTY_FORM = { name: "", email: "", phone: "", date: "", time: "", guests: "2", notes: "" };

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

const inputCls = "w-full rounded-lg border border-cream-200/10 bg-ink-800 px-3 py-2 text-sm text-cream-100 outline-none focus:border-saffron-500/40 disabled:opacity-50";

export default function StaffBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<BookingStatus | "all">("all");

  // Add booking modal state
  const [showAdd, setShowAdd] = useState(false);
  const [newBooking, setNewBooking] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  const load = useCallback(async () => {
    const res = await fetch("/api/bookings");
    if (res.ok) {
      const data: Booking[] = await res.json();
      setBookings(data.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
    }
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  async function submitAdd(e: React.FormEvent) {
    e.preventDefault();
    setFormError("");
    if (!newBooking.name.trim() || !newBooking.email.trim() || !newBooking.phone.trim() || !newBooking.date || !newBooking.time) {
      setFormError("Please fill in all required fields.");
      return;
    }
    setSaving(true);
    const res = await fetch("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...newBooking, guests: Number(newBooking.guests), status: "pending" }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setFormError(data.error || "Failed to add booking. Please try again.");
      setSaving(false);
      return;
    }
    setShowAdd(false);
    setNewBooking(EMPTY_FORM);
    await load();
    setSaving(false);
  }

  const set = (k: keyof typeof EMPTY_FORM) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setNewBooking((prev) => ({ ...prev, [k]: e.target.value }));

  const today = new Date().toISOString().split("T")[0];
  const filtered = filter === "all" ? bookings : bookings.filter((b) => b.status === filter);
  const counts = { all: bookings.length, pending: 0, confirmed: 0, cancelled: 0 };
  for (const b of bookings) counts[b.status]++;

  return (
    <div className="pt-14 lg:pt-0 max-w-4xl">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl text-cream-50">Bookings</h1>
          <p className="mt-1 text-sm text-cream-200/50">Read-only view of all table reservations</p>
        </div>
        <button
          onClick={() => { setShowAdd(true); setFormError(""); setNewBooking(EMPTY_FORM); }}
          className="shrink-0 rounded-xl bg-saffron-500 px-4 py-2 text-sm font-medium text-ink-900 transition-colors hover:bg-saffron-400"
        >
          + Add Booking
        </button>
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

      {/* Add Booking Modal */}
      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink-900/80 p-4 backdrop-blur-sm">
          <div className="card-surface w-full max-w-lg p-6">
            <h2 className="mb-5 font-display text-xl text-cream-50">Add Booking</h2>

            {formError && (
              <div className="mb-4 rounded-xl border border-ember-500/30 bg-ember-500/10 px-4 py-3 text-sm text-ember-400">
                {formError}
              </div>
            )}

            <form onSubmit={submitAdd} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="mb-1 block text-xs text-cream-200/60">Name *</label>
                  <input type="text" value={newBooking.name} onChange={set("name")} disabled={saving} placeholder="Full name" className={inputCls} />
                </div>
                <div>
                  <label className="mb-1 block text-xs text-cream-200/60">Email *</label>
                  <input type="email" value={newBooking.email} onChange={set("email")} disabled={saving} placeholder="email@example.com" className={inputCls} />
                </div>
                <div>
                  <label className="mb-1 block text-xs text-cream-200/60">Phone *</label>
                  <input type="tel" value={newBooking.phone} onChange={set("phone")} disabled={saving} placeholder="07xxx xxxxxx" className={inputCls} />
                </div>
                <div>
                  <label className="mb-1 block text-xs text-cream-200/60">Date *</label>
                  <input type="date" value={newBooking.date} onChange={set("date")} min={today} disabled={saving} className={inputCls} />
                </div>
                <div>
                  <label className="mb-1 block text-xs text-cream-200/60">Time *</label>
                  <select value={newBooking.time} onChange={set("time")} disabled={saving} className={inputCls}>
                    <option value="">Select time</option>
                    {TIME_SLOTS.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs text-cream-200/60">Guests *</label>
                  <select value={newBooking.guests} onChange={set("guests")} disabled={saving} className={inputCls}>
                    {Array.from({ length: 12 }, (_, i) => i + 1).map((n) => (
                      <option key={n} value={n}>{n} {n === 1 ? "guest" : "guests"}</option>
                    ))}
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="mb-1 block text-xs text-cream-200/60">Notes (optional)</label>
                  <textarea value={newBooking.notes} onChange={set("notes")} disabled={saving} rows={2} placeholder="Dietary requirements, occasion, etc." className={inputCls + " resize-none"} />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => { setShowAdd(false); setNewBooking(EMPTY_FORM); }}
                  disabled={saving}
                  className="rounded-xl border border-cream-200/10 px-4 py-2 text-sm text-cream-200/60 transition-colors hover:border-cream-200/30 hover:text-cream-100 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-xl bg-saffron-500 px-5 py-2 text-sm font-medium text-ink-900 transition-colors hover:bg-saffron-400 disabled:opacity-50"
                >
                  {saving ? "Adding…" : "Add Booking"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
