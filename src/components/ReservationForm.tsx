"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState, type FormEvent } from "react";
import { site } from "@/data/site";
import DatePicker from "@/components/DatePicker";

type Errors = Partial<Record<"name" | "email" | "phone" | "date" | "time" | "guests", string>>;

const times = [
  "12:00", "12:30", "13:00", "13:30", "17:00", "17:30",
  "18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00",
];

export function ReservationForm() {
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Errors>({});
  const [values, setValues] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
    time: "",
    guests: "2",
    notes: "",
  });

  const set = (k: keyof typeof values) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setValues((v) => ({ ...v, [k]: e.target.value }));

  const validate = (): Errors => {
    const err: Errors = {};
    if (!values.name.trim()) err.name = "Please tell us your name";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) err.email = "Enter a valid email";
    if (values.phone.replace(/\D/g, "").length < 7) err.phone = "Enter a contact number";
    if (!values.date) err.date = "Choose a date";
    else if (new Date(values.date) < new Date(new Date().toDateString())) err.date = "Date must be in the future";
    if (!values.time) err.time = "Choose a time";
    return err;
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const err = validate();
    setErrors(err);
    if (Object.keys(err).length > 0) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      const res = await fetch("/api/bookings/public", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, guests: Number(values.guests) }),
      });
      if (!res.ok) throw new Error("Booking failed");
      setSent(true);
    } catch {
      setSubmitError("Something went wrong. Please call us or try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="card-surface relative overflow-hidden p-7 sm:p-9">
      <AnimatePresence mode="wait">
        {sent ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center py-10 text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 14, delay: 0.1 }}
              className="flex h-16 w-16 items-center justify-center rounded-full bg-saffron-500/15 text-3xl text-saffron-400"
            >
              ✓
            </motion.div>
            <h3 className="mt-6 font-display text-2xl text-cream-50">Request received</h3>
            <p className="mt-3 max-w-sm text-cream-200/70">
              Thank you, {values.name.split(" ")[0]}. We&apos;ve noted your table for{" "}
              {values.guests} on {values.date} at {values.time}. We&apos;ll confirm by
              phone or email shortly.
            </p>
            <button
              onClick={() => {
                setSent(false);
                setValues({ name: "", email: "", phone: "", date: "", time: "", guests: "2", notes: "" });
              }}
              className="btn-ghost mt-8"
            >
              Make another booking
            </button>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onSubmit={onSubmit}
            noValidate
            className="space-y-5"
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Full name" error={errors.name}>
                <input
                  value={values.name}
                  onChange={set("name")}
                  placeholder="Jane Smith"
                  className={inputCls(errors.name)}
                />
              </Field>
              <Field label="Phone" error={errors.phone}>
                <input
                  value={values.phone}
                  onChange={set("phone")}
                  placeholder="07123 456789"
                  inputMode="tel"
                  className={inputCls(errors.phone)}
                />
              </Field>
            </div>

            <Field label="Email" error={errors.email}>
              <input
                value={values.email}
                onChange={set("email")}
                placeholder="jane@email.com"
                inputMode="email"
                className={inputCls(errors.email)}
              />
            </Field>

            <div className="grid gap-5 sm:grid-cols-3">
              <Field label="Date" error={errors.date}>
                <DatePicker
                  value={values.date}
                  onChange={(d) => setValues((v) => ({ ...v, date: d }))}
                  min={today}
                  error={!!errors.date}
                  placeholder="Select date"
                  triggerClassName={`w-full rounded-xl border px-4 py-3 text-left transition-colors outline-none disabled:opacity-50 ${
                    errors.date
                      ? "border-ember-400 bg-ink-900/60 text-cream-50"
                      : "border-cream-200/15 bg-ink-900/60 text-cream-50 focus:border-saffron-500"
                  }`}
                />
              </Field>
              <Field label="Time" error={errors.time}>
                <select value={values.time} onChange={set("time")} className={inputCls(errors.time)}>
                  <option value="">Select</option>
                  {times.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </Field>
              <Field label="Guests" error={errors.guests}>
                <select value={values.guests} onChange={set("guests")} className={inputCls()}>
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((n) => (
                    <option key={n} value={String(n)}>{n}{n === 12 ? "+" : ""}</option>
                  ))}
                </select>
              </Field>
            </div>

            <Field label="Special requests (optional)">
              <textarea
                value={values.notes}
                onChange={set("notes")}
                rows={3}
                placeholder="Allergies, high chair, celebration…"
                className={`${inputCls()} resize-none`}
              />
            </Field>

            {submitError && (
              <p className="rounded-lg border border-ember-400/30 bg-ember-400/10 px-4 py-3 text-sm text-ember-400">
                {submitError}
              </p>
            )}

            <button type="submit" disabled={submitting} className="btn-gold w-full !py-4">
              {submitting ? "Sending…" : "Request Booking"}
            </button>
            <p className="text-center text-xs text-cream-200/40">
              Prefer to talk? Call us on{" "}
              <a href={site.phoneHref} className="text-saffron-400 hover:underline">
                {site.phone}
              </a>
            </p>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}

function inputCls(error?: string) {
  return `w-full rounded-xl border bg-ink-900/60 px-4 py-3 text-cream-50 placeholder:text-cream-200/30 outline-none transition-colors focus:border-saffron-500 ${
    error ? "border-ember-400" : "border-cream-200/15"
  }`;
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-cream-200/60">
        {label}
      </span>
      {children}
      {error && <span className="mt-1 block text-xs text-ember-400">{error}</span>}
    </label>
  );
}
