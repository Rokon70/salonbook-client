"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import AuthShell, { GoogleButton } from "@/components/AuthShell";
import ImageUploader from "@/components/ImageUploader";
import { Spinner } from "@/components/ui";
import { authClient } from "@/lib/auth-client";

function validate(f) {
  if (f.name.trim().length < 2) return "Enter your full name";
  if (!/^\S+@\S+\.\S+$/.test(f.email)) return "Enter a valid email address";
  if (f.password.length < 6) return "Password must be at least 6 characters";
  if (!/[A-Z]/.test(f.password)) return "Password needs at least one uppercase letter";
  if (!/[a-z]/.test(f.password)) return "Password needs at least one lowercase letter";
  return "";
}

export default function SignUpPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "", image: "" });
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  async function onSubmit(e) {
    e.preventDefault();
    const problem = validate(form);
    if (problem) return toast.error(problem);
    setBusy(true);
    const { error } = await authClient.signUp.email({ name: form.name.trim(), email: form.email, password: form.password, image: form.image || undefined });
    setBusy(false);
    if (error) return toast.error(error.message || "Could not create your account");
    toast.success("Account created. Welcome to SalonBook!");
    router.push("/dashboard"); // new accounts are always customers
    router.refresh();
  }

  async function google() {
    setBusy(true);
    const { error } = await authClient.signIn.social({ provider: "google", callbackURL: "/dashboard" });
    if (error) { setBusy(false); toast.error(error.message || "Google sign up failed"); }
  }

  return (
    <AuthShell title="Create your account" subtitle="Book appointments and track them in one place."
      footer={<>Already have an account? <Link href="/signin" className="font-semibold text-berry-700">Sign in</Link></>}>
      <form onSubmit={onSubmit} className="space-y-4" noValidate>
        <div><label className="label" htmlFor="name">Full name</label>
          <input id="name" className="input" autoComplete="name" value={form.name} onChange={set("name")} /></div>
        <div><label className="label" htmlFor="email">Email</label>
          <input id="email" type="email" className="input" autoComplete="email" value={form.email} onChange={set("email")} /></div>
        <div><label className="label" htmlFor="password">Password</label>
          <input id="password" type="password" className="input" autoComplete="new-password" value={form.password} onChange={set("password")} />
          <p className="mt-1 text-xs text-ink-faint">At least 6 characters, with one uppercase and one lowercase letter.</p></div>
        <div><span className="label">Profile image (optional)</span>
          <ImageUploader allowUrl round value={form.image} onChange={(image) => setForm((f) => ({ ...f, image }))} /></div>
        <button className="btn-primary w-full" disabled={busy}>{busy && <Spinner className="h-4 w-4" />}Create account</button>
      </form>
      <div className="my-5 flex items-center gap-3 text-xs text-ink-faint"><span className="h-px flex-1 bg-berry-100" />or<span className="h-px flex-1 bg-berry-100" /></div>
      <GoogleButton onClick={google} disabled={busy} />
    </AuthShell>
  );
}
