import Link from "next/link";
import { Scissors } from "lucide-react";

export default function AuthShell({ title, subtitle, children, footer }) {
  return (
    <div className="container-page flex min-h-[75vh] items-center justify-center py-10">
      <div className="card w-full max-w-md p-6 sm:p-8">
        <Link href="/" className="mb-4 flex items-center gap-2 font-display text-xl text-berry-700"><Scissors className="h-5 w-5" />SalonBook</Link>
        <h1 className="text-3xl font-semibold">{title}</h1>
        <p className="mb-6 mt-1 text-sm text-ink-soft">{subtitle}</p>
        {children}
        <p className="mt-6 text-center text-sm text-ink-soft">{footer}</p>
      </div>
    </div>
  );
}

export function GoogleButton({ onClick, disabled }) {
  return (
    <button type="button" onClick={onClick} disabled={disabled} className="btn-outline w-full">
      <svg className="h-4 w-4" viewBox="0 0 48 48" aria-hidden>
        <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.8 2.4 30.3 0 24 0 14.6 0 6.5 5.4 2.6 13.2l7.9 6.1C12.4 13.6 17.7 9.5 24 9.5z"/>
        <path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.7c-.6 3-2.3 5.5-4.8 7.2l7.5 5.8c4.4-4.1 7.1-10.1 7.1-17.5z"/>
        <path fill="#FBBC05" d="M10.5 28.7a14.5 14.5 0 010-9.4l-7.9-6.1a24 24 0 000 21.6l7.9-6.1z"/>
        <path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.5-5.8c-2.1 1.4-4.9 2.3-8.4 2.3-6.3 0-11.6-4.1-13.5-9.8l-7.9 6.1C6.5 42.6 14.6 48 24 48z"/>
      </svg>
      Continue with Google
    </button>
  );
}
