"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { api } from "@/lib/api";
import { CATEGORIES } from "@/lib/utils";
import ImageUploader from "./ImageUploader";
import { Spinner } from "./ui";

export default function ServiceForm({ service }) {
  const router = useRouter();
  const editing = !!service;
  const [form, setForm] = useState({
    serviceName: service?.serviceName || "", category: service?.category || "", description: service?.description || "",
    price: service?.price ?? "", duration: service?.duration ?? "", image: service?.image || "", status: service?.status || "active",
  });
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  async function submit(e) {
    e.preventDefault();
    if (!form.serviceName.trim()) return toast.error("Enter a service name");
    if (!form.category) return toast.error("Choose a category");
    if (form.description.trim().length < 10) return toast.error("Description must be at least 10 characters");
    if (!(Number(form.price) > 0)) return toast.error("Price must be a positive number");
    if (!(Number(form.duration) > 0)) return toast.error("Duration must be a positive number");
    if (!form.image) return toast.error("Upload a service image");
    setBusy(true);
    try {
      const body = { ...form, price: Number(form.price), duration: Number(form.duration) };
      const res = editing ? await api(`/services/${service._id}`, { method: "PUT", body }) : await api("/services", { method: "POST", body });
      toast.success(res.message);
      router.push("/dashboard/admin/services");
    } catch (err) { toast.error(err.message); } finally { setBusy(false); }
  }

  return (
    <form onSubmit={submit} className="card max-w-2xl space-y-4 p-6" noValidate>
      <div><label className="label" htmlFor="sn">Service name</label><input id="sn" className="input" value={form.serviceName} onChange={set("serviceName")} /></div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div><label className="label" htmlFor="sc">Category</label>
          <select id="sc" className="input" value={form.category} onChange={set("category")}>
            <option value="">Select category</option>
            {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </select></div>
        <div><label className="label" htmlFor="ss">Status</label>
          <select id="ss" className="input" value={form.status} onChange={set("status")}>
            <option value="active">Active</option><option value="inactive">Inactive</option>
          </select></div>
      </div>
      <div><label className="label" htmlFor="sd">Description</label><textarea id="sd" rows={4} className="input" value={form.description} onChange={set("description")} /></div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div><label className="label" htmlFor="sp">Price (USD)</label><input id="sp" type="number" min="0" step="0.01" className="input" value={form.price} onChange={set("price")} /></div>
        <div><label className="label" htmlFor="sm">Estimated duration (minutes)</label><input id="sm" type="number" min="1" step="1" className="input" value={form.duration} onChange={set("duration")} /></div>
      </div>
      <div><span className="label">Service image</span><ImageUploader value={form.image} onChange={(image) => setForm((f) => ({ ...f, image }))} /></div>
      <div className="flex gap-3">
        <button className="btn-primary" disabled={busy}>{busy && <Spinner className="h-4 w-4" />}{editing ? "Save changes" : "Create service"}</button>
        <button type="button" className="btn-outline" onClick={() => router.push("/dashboard/admin/services")}>Cancel</button>
      </div>
    </form>
  );
}
