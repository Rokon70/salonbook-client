"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { api } from "@/lib/api";
import { authClient } from "@/lib/auth-client";
import ImageUploader from "./ImageUploader";
import { PageLoader, Spinner, ErrorBox } from "./ui";
import { useFetch } from "@/hooks/useFetch";

export default function ProfileForm() {
  const router = useRouter();
  const { data, loading, error, reload } = useFetch(() => api("/profile"), []);
  if (loading) return <PageLoader label="Loading profile…" />;
  if (error) return <ErrorBox message={error} onRetry={reload} />;
  return <Inner user={data.user} onSaved={() => { router.refresh(); }} />;
}

function Inner({ user, onSaved }) {
  const [form, setForm] = useState({ name: user.name || "", phone: user.phone || "", image: user.image || "" });
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    if (form.name.trim().length < 2) return toast.error("Name must be at least 2 characters");
    setBusy(true);
    try {
      const res = await api("/profile", { method: "PATCH", body: { name: form.name, phone: form.phone, image: form.image } });
      toast.success(res.message);
      await authClient.getSession({ query: { disableCookieCache: true } });
      onSaved();
    } catch (err) { toast.error(err.message); } finally { setBusy(false); }
  }

  return (
    <div>
      <h1 className="text-3xl font-semibold">My profile</h1>
      <form onSubmit={submit} className="card mt-6 max-w-xl space-y-4 p-6">
        <div><span className="label">Profile image</span>
          <ImageUploader allowUrl round value={form.image} onChange={(image) => setForm((f) => ({ ...f, image }))} /></div>
        <div><label className="label" htmlFor="pn">Full name</label>
          <input id="pn" className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
        <div><label className="label" htmlFor="pe">Email</label>
          <input id="pe" className="input bg-slate-50" value={user.email} disabled readOnly />
          <p className="mt-1 text-xs text-ink-faint">Email, role and account status cannot be changed here.</p></div>
        <div><label className="label" htmlFor="pp">Phone number</label>
          <input id="pp" className="input" placeholder="+880 1XXX-XXXXXX" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
        <button className="btn-primary" disabled={busy}>{busy && <Spinner className="h-4 w-4" />}Save changes</button>
      </form>
    </div>
  );
}
