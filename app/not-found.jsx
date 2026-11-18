import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-page flex min-h-[60vh] flex-col items-center justify-center text-center">
      <p className="font-display text-7xl font-semibold text-berry-300">404</p>
      <h1 className="mt-2 text-2xl font-semibold">This page does not exist</h1>
      <p className="mt-2 text-ink-soft">The link may be broken or the page may have moved.</p>
      <Link href="/" className="btn-primary mt-6">Go to home</Link>
    </div>
  );
}
