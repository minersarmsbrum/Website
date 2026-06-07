import Link from "next/link";

export default function NotFound() {
  return (
    <section className="flex min-h-[80vh] items-center justify-center bg-ink-900 px-6 pt-20">
      <div className="text-center">
        <p className="font-display text-8xl gold-text">404</p>
        <h1 className="heading-md mt-4 text-cream-50">This table isn&apos;t set</h1>
        <p className="body-lg mx-auto mt-4 max-w-md">
          The page you&apos;re looking for has left the kitchen. Let&apos;s get you
          back to something delicious.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link href="/" className="btn-gold">Back home</Link>
          <Link href="/menu" className="btn-ghost">View the menu</Link>
        </div>
      </div>
    </section>
  );
}
