"use client";
import { useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { ConfirmDialog, EmptyState, ErrorBox, PageLoader, StatusBadge } from "@/components/ui";
import { useFetch } from "@/hooks/useFetch";
import { api } from "@/lib/api";
import { money } from "@/lib/utils";

export default function ManageServices() {
  const { data, loading, error, reload } = useFetch(() => api("/services/admin/all"), []);
  const [del, setDel] = useState(null);
  const [busy, setBusy] = useState(false);

  async function toggle(s) {
    try {
      const res = await api(`/services/${s._id}/status`, { method: "PATCH", body: { status: s.status === "active" ? "inactive" : "active" } });
      toast.success(res.message);
      reload();
    } catch (err) { toast.error(err.message); }
  }

  async function remove() {
    setBusy(true);
    try {
      const res = await api(`/services/${del._id}`, { method: "DELETE" });
      toast.success(res.message);
      setDel(null);
      reload();
    } catch (err) { toast.error(err.message); setDel(null); } finally { setBusy(false); }
  }

  if (loading) return <PageLoader label="Loading services…" />;
  if (error) return <ErrorBox message={error} onRetry={reload} />;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl font-semibold">Manage services</h1>
        <Link href="/dashboard/admin/services/new" className="btn-primary"><Plus className="h-4 w-4" />Add service</Link>
      </div>
      {data.services.length === 0 ? (
        <div className="mt-6"><EmptyState title="No services yet" text="Add your first service so customers can book it." /></div>
      ) : (
        <div className="card mt-6 overflow-x-auto">
          <table className="w-full min-w-[760px]">
            <thead className="border-b border-berry-100 bg-berry-50/50">
              <tr>{["Service", "Category", "Price", "Duration", "Status", "Actions"].map((h) => <th key={h} className="th">{h}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-berry-50">
              {data.services.map((s) => (
                <tr key={s._id}>
                  <td className="td">
                    <div className="flex items-center gap-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      {s.image && <img src={s.image} alt="" className="h-12 w-12 rounded-lg object-cover" />}
                      <span className="font-medium">{s.serviceName}</span>
                    </div>
                  </td>
                  <td className="td text-ink-soft">{s.category}</td>
                  <td className="td font-medium">{money(s.price)}</td>
                  <td className="td">{s.duration} min</td>
                  <td className="td"><StatusBadge value={s.status} /></td>
                  <td className="td">
                    <div className="flex flex-wrap gap-2">
                      <button className="btn-outline btn-sm" onClick={() => toggle(s)}>{s.status === "active" ? "Deactivate" : "Activate"}</button>
                      <Link href={`/dashboard/admin/services/${s._id}`} className="btn-outline btn-sm"><Pencil className="h-3.5 w-3.5" />Edit</Link>
                      <button className="btn-outline btn-sm text-red-600" onClick={() => setDel(s)}><Trash2 className="h-3.5 w-3.5" />Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {del && <ConfirmDialog title="Delete this service?" danger busy={busy} confirmText="Delete service" onClose={() => setDel(null)} onConfirm={remove}
        message={`"${del.serviceName}" will be removed permanently. Services with active appointments cannot be deleted; deactivate them instead.`} />}
    </div>
  );
}
