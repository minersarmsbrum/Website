"use client";

import { useEffect, useState, useCallback } from "react";
import type { Booking, BookingStatus } from "@/lib/store";

const TIME_SLOTS = ["12:00","12:30","13:00","13:30","17:00","17:30","18:00","18:30","19:00","19:30","20:00","20:30","21:00"];

const EMPTY_FORM = { name: "", email: "", phone: "", date: "", time: "", guests: "2", notes: "", status: "confirmed" };
const EMPTY_EDIT = { date: "", time: "", guests: "2" };

function StatusBadge({ status }: { status: BookingStatus }) {
  const cls =
    status === "confirmed" ? "bg-jade-500/15 text-jade-400 border-jade-500/20" :
    "bg-ember-500/15 text-ember-400 border-ember-500/20";
  return (
    <span className={`rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize ${cls}`}>
      {status}
    </span>
  );
}

const inputCls = "w-full rounded-lg border border-cream-200/10 bg-ink-800 px-3 py-2 text-sm text-cream-100 outline-none focus:border-saffron-500/40 disabled:opacity-50";

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [filter, setFilter] = useState<BookingStatus | "all">("all");
  const [actionError, setActionError] = useState("");

  // Add booking modal
  const [showAdd, setShowAdd] = useState(false);
  const [newBooking, setNewBooking] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  // Edit booking modal
  const [editTarget, setEditTarget] = useState<Booking | null>(null);
  const [editForm, setEditForm] = useState(EMPTY_EDIT);
  const [editSaving, setEditSaving] = useState(false);
  const [editError, setEditError] = useState("");

  const load = useCallback(async () => {
    const res = await fetch("/api/bookings");
    if (res.ok) {
      const data: Booking[] = await res.json();
      setBookings(data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    }
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  async function cancelBooking(id: string) {
    if (!confirm("Cancel this booking?")) return;
    setActionError("");
    setUpdating(id);
    const res = await fetch(`/api/bookings/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "cancelled" }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setActionError(data.error || "Failed to cancel booking. Please try again.");
    }
    await load();
    setUpdating(null);
  }

  async function deleteBooking(id: string) {
    if (!confirm("Delete this booking?")) return;
    setActionError("");
    setUpdating(id);
    const res = await fetch(`/api/bookings/${id}`, { method: "DELETE" });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setActionError(data.error || "Failed to delete booking. Please try again.");
    }
    await load();
    setUpdating(null);
  }

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
      body: JSON.stringify({ ...newBooking, guests: Number(newBooking.guests) }),
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

  function openEdit(b: Booking) {
    setEditTarget(b);
    setEditForm({ date: b.date, time: b.time, guests: String(b.guests) });
    setEditError("");
  }

  async function submitEdit(e: React.FormEvent) {
    e.preventDefault();
    if (!editTarget) return;
    setEditError("");
    if (!editForm.date || !editForm.time) {
      setEditError("Date and time are required.");
      return;
    }
    setEditSaving(true);
    const res = await fetch(`/api/bookings/${editTarget.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date: editForm.date, time: editForm.time, guests: Number(editForm.guests) }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setEditError(data.error || "Failed to update booking. Please try again.");
      setEditSaving(false);
      return;
    }
    setEditTarget(null);
    await load();
    setEditSaving(false);
  }

  const set = (k: keyof typeof EMPTY_FORM) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setNewBooking((prev) => ({ ...prev, [k]: e.target.value }));

  const setEdit = (k: keyof typeof EMPTY_EDIT) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setEditForm((prev) => ({ ...prev, [k]: e.target.value }));

  const today = new Date().toISOString().split("T")[0];
  const filtered = filter === "all" ? bookings : bookings.filter((b) => b.status === filter);
  const counts = { all: bookings.length, confirmed: 0, cancelled: 0 };
  for (const b of bookings) counts[b.status]++;

  return (
    <div className="pt-14 lg:pt-0 max-w-6xl">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl text-cream-50">Bookings</h1>
          <p className="mt-1 text-sm text-cream-200/50">Manage table reservations</p>
        </div>
        <button
          onClick={() => { setShowAdd(true); setFormError(""); setNewBooking(EMPTY_FORM); }}
          className="shrink-0 rounded-xl bg-saffron-500 px-4 py-2 text-sm font-medium text-ink-900 transition-colors hover:bg-saffron-400"
        >
          + Add Booking
        </button>
      </div>

      {actionError && (
        <div className="mb-4 rounded-xl border border-ember-500/30 bg-ember-500/10 px-4 py-3 text-sm text-ember-400">
          {actionError}
        </div>
      )}

      {/* Filter tabs */}
      <div className="mb-5 flex flex-wrap gap-2">
        {(["all", "confirmed", "cancelled"] as const).map((f) => (
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
                  <button
                    onClick={() => openEdit(b)}
                    disabled={updating === b.id}
                    className="rounded-lg border border-saffron-500/30 bg-saffron-500/10 px-3 py-1.5 text-xs text-saffron-400 transition-colors hover:bg-saffron-500/20 disabled:opacity-50"
                  >
                    Edit
                  </button>
                  {b.status !== "cancelled" && (
                    <button
                      onClick={() => cancelBooking(b.id)}
                      disabled={updating === b.id}
                      className="rounded-lg border border-ember-500/20 bg-ember-500/10 px-3 py-1.5 text-xs text-ember-400 transition-colors hover:bg-ember-500/20 disabled:opacity-50"
                    >
                      Cancel
                    </button>
                  )}
                  <button
                    onClick={() => deleteBooking(b.id)}
                    disabled={updating === b.id}
                    className="rounded-lg border border-cream-200/10 bg-ink-700/40 px-3 py-1.5 text-xs text-cream-200/50 transition-colors hover:border-ember-500/20 hover:bg-ember-500/10 hover:text-ember-400 disabled:opacity-50"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Booking Modal */}
      {editTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink-900/80 p-4 backdrop-blur-sm">
          <div className="card-surface w-full max-w-sm p-6">
            <h2 className="mb-1 font-display text-xl text-cream-50">Edit Booking</h2>
            <p className="mb-5 text-xs text-cream-200/50">{editTarget.name}</p>

            {editError && (
              <div className="mb-4 rounded-xl border border-ember-500/30 bg-ember-500/10 px-4 py-3 text-sm text-ember-400">
                {editError}
              </div>
            )}

            <form onSubmit={submitEdit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="mb-1 block text-xs text-cream-200/60">Date *</label>
                  <input type="date" value={editForm.date} onChange={setEdit("date")} min={today} disabled={editSaving} className={inputCls} />
                </div>
                <div>
                  <label className="mb-1 block text-xs text-cream-200/60">Time *</label>
                  <select value={editForm.time} onChange={setEdit("time")} disabled={editSaving} className={inputCls}>
                    <option value="">Select time</option>
                    {TIME_SLOTS.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs text-cream-200/60">Guests</label>
                  <select value={editForm.guests} onChange={setEdit("guests")} disabled={editSaving} className={inputCls}>
                    {Array.from({ length: 12 }, (_, i) => i + 1).map((n) => (
                      <option key={n} value={n}>{n} {n === 1 ? "guest" : "guests"}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setEditTarget(null)}
                  disabled={editSaving}
                  className="rounded-xl border border-cream-200/10 px-4 py-2 text-sm text-cream-200/60 transition-colors hover:border-cream-200/30 hover:text-cream-100 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={editSaving}
                  className="rounded-xl bg-saffron-500 px-5 py-2 text-sm font-medium text-ink-900 transition-colors hover:bg-saffron-400 disabled:opacity-50"
                >
                  {editSaving ? "Saving…" : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
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
