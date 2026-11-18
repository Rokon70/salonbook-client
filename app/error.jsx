"use client";

export default function GlobalError({ error, reset }) {
  return (
    <div className="container-page flex min-h-[50vh] flex-col items-center justify-center text-center">
      <h1 className="text-3xl font-semibold">Something went wrong</h1>
      <p className="mt-2 max-w-md text-ink-soft">{error?.message || "An unexpected error happened."}</p>
      <button onClick={reset} className="btn-primary mt-6">Try again</button>
    </div>
  );
}
