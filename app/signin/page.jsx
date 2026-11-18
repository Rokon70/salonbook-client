"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import AuthShell, { GoogleButton } from "@/components/AuthShell";
import { Spinner } from "@/components/ui";
import { authClient } from "@/lib/auth-client";

const nextPath = () => {
  const n = new URLSearchParams(window.location.search).get("next");
  return n && n.startsWith("/") && !n.startsWith("//") ? n : "/dashboard";
};

export default function SignInPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [busy, setBusy] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    if (!form.email || !form.password) return toast.error("Enter your email and password");
    setBusy(true);
    const { error } = await authClient.signIn.email({ email: form.email, password: form.password });
    setBusy(false);
    if (error) return toast.error(error.message || "Incorrect email or password");
    toast.success("Welcome back!");
    router.push(nextPath()); // /dashboard redirects to the right dashboard for the role
    router.refresh();
  }

  async function google() {
    setBusy(true);
    const { error } = await authClient.signIn.social({ provider: "google", callbackURL: nextPath() });
    if (error) { setBusy(false); toast.error(error.message || "Google sign in failed"); }
  }

  return (
    <AuthShell title="Sign in" subtitle="Welcome back. Sign in to manage your appointments."
      footer={<>New to SalonBook? <Link href="/signup" className="font-semibold text-berry-700">Create an account</Link></>}>
      <form onSubmit={onSubmit} className="space-y-4" noValidate>
        <div><label className="label" htmlFor="email">Email</label>
          <input id="email" type="email" className="input" autoComplete="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
        <div><label className="label" htmlFor="password">Password</label>
          <input id="password" type="password" className="input" autoComplete="current-password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /></div>
        <button className="btn-primary w-full" disabled={busy}>{busy && <Spinner className="h-4 w-4" />}Sign in</button>
      </form>
      <div className="my-5 flex items-center gap-3 text-xs text-ink-faint"><span className="h-px flex-1 bg-berry-100" />or<span className="h-px flex-1 bg-berry-100" /></div>
      <GoogleButton onClick={google} disabled={busy} />
    </AuthShell>
  );
}
