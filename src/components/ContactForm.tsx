"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState, type FormEvent } from "react";

type Errors = Partial<Record<"name" | "email" | "message", string>>;

export function ContactForm() {
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [values, setValues] = useState({ name: "", email: "", subject: "General enquiry", message: "" });

  const set = (k: keyof typeof values) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setValues((v) => ({ ...v, [k]: e.target.value }));

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const err: Errors = {};
    if (!values.name.trim()) err.name = "Please tell us your name";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) err.email = "Enter a valid email";
    if (values.message.trim().length < 10) err.message = "A little more detail, please";
    setErrors(err);
    if (Object.keys(err).length > 0) return;
    setSubmitting(true);
    try {
      await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      setSent(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="card-surface p-7 sm:p-9">
      <AnimatePresence mode="wait">
        {sent ? (
          <motion.div
            key="ok"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center py-10 text-center"
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-saffron-500/15 text-3xl text-saffron-400">
              ✓
            </div>
            <h3 className="mt-6 font-display text-2xl text-cream-50">Message sent</h3>
            <p className="mt-3 max-w-sm text-cream-200/70">
              Thanks {values.name.split(" ")[0]} — we&apos;ll get back to you as soon
              as we can.
            </p>
            <button onClick={() => { setSent(false); setValues({ name: "", email: "", subject: "General enquiry", message: "" }); }} className="btn-ghost mt-8">
              Send another
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
              <Field label="Name" error={errors.name}>
                <input value={values.name} onChange={set("name")} placeholder="Your name" className={inputCls(errors.name)} />
              </Field>
              <Field label="Email" error={errors.email}>
                <input value={values.email} onChange={set("email")} placeholder="you@email.com" inputMode="email" className={inputCls(errors.email)} />
              </Field>
            </div>
            <Field label="Subject">
              <select value={values.subject} onChange={set("subject")} className={inputCls()}>
                <option>General enquiry</option>
                <option>Large group / event</option>
                <option>Takeaway / catering</option>
                <option>Feedback</option>
              </select>
            </Field>
            <Field label="Message" error={errors.message}>
              <textarea value={values.message} onChange={set("message")} rows={5} placeholder="How can we help?" className={`${inputCls(errors.message)} resize-none`} />
            </Field>
            <button type="submit" disabled={submitting} className="btn-gold w-full !py-4">
              {submitting ? "Sending…" : "Send Message"}
            </button>
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

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-cream-200/60">{label}</span>
      {children}
      {error && <span className="mt-1 block text-xs text-ember-400">{error}</span>}
    </label>
  );
}
