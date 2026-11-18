"use client";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Ban, Eye, Search, UserCheck } from "lucide-react";
import { Avatar } from "@/components/Navbar";
import { ConfirmDialog, DetailRow, EmptyState, ErrorBox, Modal, PageLoader, StatusBadge } from "@/components/ui";
import { useFetch } from "@/hooks/useFetch";
import { api } from "@/lib/api";
import { formatDate } from "@/lib/utils";

export default function ManageUsers() {
  const [search, setSearch] = useState("");
  const [q, setQ] = useState("");
  useEffect(() => { const t = setTimeout(() => setQ(search.trim()), 350); return () => clearTimeout(t); }, [search]);

  const { data, loading, error, reload } = useFetch(() => api(`/users${q ? `?search=${encodeURIComponent(q)}` : ""}`), [q]);
  const [view, setView] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const [busy, setBusy] = useState(false);

  async function openDetails(u) {
    try { setView(await api(`/users/${u._id}`)); } catch (err) { toast.error(err.message); }
  }
  async function run() {
    setBusy(true);
    try {
      const res = await api(`/users/${confirm._id}/${confirm.isBlocked ? "unblock" : "block"}`, { method: "PATCH" });
      toast.success(res.message);
      setConfirm(null);
      reload();
    } catch (err) { toast.error(err.message); setConfirm(null); } finally { setBusy(false); }
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl font-semibold">Manage users</h1>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-faint" />
          <input className="input pl-9" placeholder="Search name or email" value={search} onChange={(e) => setSearch(e.target.value)} aria-label="Search users" />
        </div>
      </div>

      {loading ? <PageLoader label="Loading customers…" /> : error ? <ErrorBox message={error} onRetry={reload} /> :
        data.users.length === 0 ? <div className="mt-6"><EmptyState title="No customers found" /></div> : (
          <div className="card mt-6 overflow-x-auto">
            <table className="w-full min-w-[720px]">
              <thead className="border-b border-berry-100 bg-berry-50/50"><tr>{["Customer", "Phone", "Joined", "Status", "Actions"].map((h) => <th key={h} className="th">{h}</th>)}</tr></thead>
              <tbody className="divide-y divide-berry-50">
                {data.users.map((u) => (
                  <tr key={u._id}>
                    <td className="td"><div className="flex items-center gap-3"><Avatar user={u} size="h-9 w-9" /><div><p className="font-medium">{u.name}</p><p className="text-xs text-ink-faint">{u.email}</p></div></div></td>
                    <td className="td">{u.phone || "-"}</td>
                    <td className="td text-ink-soft">{formatDate(u.createdAt)}</td>
                    <td className="td"><StatusBadge value={u.isBlocked ? "blocked" : "active"} /></td>
                    <td className="td">
                      <div className="flex gap-2">
                        <button className="btn-outline btn-sm" onClick={() => openDetails(u)}><Eye className="h-3.5 w-3.5" />Details</button>
                        <button className={`btn-outline btn-sm ${u.isBlocked ? "" : "text-red-600"}`} onClick={() => setConfirm(u)}>
                          {u.isBlocked ? <><UserCheck className="h-3.5 w-3.5" />Unblock</> : <><Ban className="h-3.5 w-3.5" />Block</>}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      {view && (
        <Modal title="User details" onClose={() => setView(null)}>
          <DetailRow label="Name">{view.user.name}</DetailRow>
          <DetailRow label="Email">{view.user.email}</DetailRow>
          <DetailRow label="Phone">{view.user.phone || "-"}</DetailRow>
          <DetailRow label="Joined">{formatDate(view.user.createdAt)}</DetailRow>
          <DetailRow label="Appointments">{view.appointments}</DetailRow>
          <DetailRow label="Status"><StatusBadge value={view.user.isBlocked ? "blocked" : "active"} /></DetailRow>
        </Modal>
      )}
      {confirm && (
        <ConfirmDialog busy={busy} danger={!confirm.isBlocked} onClose={() => setConfirm(null)} onConfirm={run}
          title={confirm.isBlocked ? "Unblock this user?" : "Block this user?"} confirmText={confirm.isBlocked ? "Unblock" : "Block user"}
          message={confirm.isBlocked ? `${confirm.name} will be able to use SalonBook again.` : `${confirm.name} will lose access to appointments and payments until you unblock them.`} />
      )}
    </div>
  );
}
