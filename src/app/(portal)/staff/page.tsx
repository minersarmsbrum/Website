import Link from "next/link";
import { store } from "@/lib/store";

export default function StaffPortalPage() {
  const bookings = store.bookings.list();
  const today = new Date().toISOString().split("T")[0];
  const todayBookings = bookings.filter((b) => b.date === today && b.status !== "cancelled");
  const pending = bookings.filter((b) => b.status === "pending").length;

  return (
    <div className="pt-14 lg:pt-0 max-w-2xl">
      <div className="mb-8">
        <h1 className="font-display text-3xl text-cream-50">Staff Portal</h1>
        <p className="mt-1 text-sm text-cream-200/50">Welcome back. Here&apos;s today at a glance.</p>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
        <div className="card-surface p-5">
          <p className="font-display text-3xl text-saffron-400">{todayBookings.length}</p>
          <p className="mt-1 text-xs text-cream-200/50">Today&apos;s bookings</p>
        </div>
        <div className="card-surface p-5">
          <p className="font-display text-3xl text-amber-400">{pending}</p>
          <p className="mt-1 text-xs text-cream-200/50">Pending confirmation</p>
        </div>
        <div className="card-surface p-5">
          <p className="font-display text-3xl text-cream-200/40">{bookings.length}</p>
          <p className="mt-1 text-xs text-cream-200/50">Total bookings</p>
        </div>
      </div>

      <Link href="/staff/bookings" className="btn-gold inline-flex">
        View All Bookings →
      </Link>
    </div>
  );
}
