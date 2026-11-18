"use client";
import { useState } from "react";
import toast from "react-hot-toast";
import { Check, Eye, X } from "lucide-react";
import { ConfirmDialog, DetailRow, EmptyState, ErrorBox, Modal, PageLoader, StatusBadge } from "@/components/ui";
import { useFetch } from "@/hooks/useFetch";
import { api } from "@/lib/api";
import { formatDate, money } from "@/lib/utils";

export default function ManageAppointments() {
  const [filter, setFilter] = useState("");
  const { data, loading, error, reload } = useFetch(() => api(`/appointments${filter ? `?status=${filter}` : ""}`), [filter]);
  const [view, setView] = useState(null);
  const [action, setAction] = useState(null); // { type, appt }
  const [busy, setBusy] = useState(false);

  async function run() {
    setBusy(true);
    try {
      const res = await api(`/appointments/${action.appt._id}/${action.type}`, { method: "PATCH" });
      toast.success(res.message);
      setAction(null);
      reload();
    } catch (err) { toast.error(err.message); setAction(null); } finally { setBusy(false); }
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl font-semibold">Manage appointments</h1>
        <select className="input w-44" value={filter} onChange={(e) => setFilter(e.target.value)} aria-label="Filter by status">
          <option value="">All statuses</option><option value="pending">Pending</option><option value="confirmed">Confirmed</option><option value="cancelled">Cancelled</option>
        </select>
      </div>

      {loading ? <PageLoader label="Loading appointments…" /> : error ? <ErrorBox message={error} onRetry={reload} /> :
        data.appointments.length === 0 ? <div className="mt-6"><EmptyState title="No appointments found" text="Requests from customers will appear here." /></div> : (
          <div className="card mt-6 overflow-x-auto">
            <table className="w-full min-w-[980px]">
              <thead className="border-b border-berry-100 bg-berry-50/50">
                <tr>{["Customer", "Service", "Date & time", "Price", "Status", "Payment", "Requested", "Actions"].map((h) => <th key={h} className="th">{h}</th>)}</tr>
              </thead>
              <tbody className="divide-y divide-berry-50">
                {data.appointments.map((a) => (
                  <tr key={a._id}>
                    <td className="td"><p className="font-medium">{a.customer.name}</p><p className="text-xs text-ink-faint">{a.customer.email}</p></td>
                    <td className="td">{a.service.serviceName}</td>
                    <td className="td">{formatDate(a.appointmentDate)}<br /><span className="text-xs text-ink-faint">{a.timeSlot}</span></td>
                    <td className="td font-medium">{money(a.servicePrice)}</td>
                    <td className="td"><StatusBadge value={a.status} /></td>
                    <td className="td"><StatusBadge value={a.paymentStatus} /></td>
                    <td className="td text-ink-soft">{formatDate(a.createdAt)}</td>
                    <td className="td">
                      <div className="flex flex-wrap gap-2">
                        <button className="btn-outline btn-sm" onClick={() => setView(a)}><Eye className="h-3.5 w-3.5" />View</button>
                        {a.status === "pending" && <button className="btn-primary btn-sm" onClick={() => setAction({ type: "confirm", appt: a })}><Check className="h-3.5 w-3.5" />Confirm</button>}
                        {(a.status === "pending" || a.status === "confirmed") && a.paymentStatus !== "paid" &&
                          <button className="btn-outline btn-sm text-red-600" onClick={() => setAction({ type: "cancel", appt: a })}><X className="h-3.5 w-3.5" />Cancel</button>}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      {view && (
        <Modal title="Appointment details" onClose={() => setView(null)}>
          <DetailRow label="Customer">{view.customer.name}</DetailRow>
          <DetailRow label="Email">{view.customer.email}</DetailRow>
          <DetailRow label="Phone">{view.customer.phone || "-"}</DetailRow>
          <DetailRow label="Service">{view.service.serviceName}</DetailRow>
          <DetailRow label="Date">{formatDate(view.appointmentDate)}</DetailRow>
          <DetailRow label="Time">{view.timeSlot}</DetailRow>
          <DetailRow label="Price">{money(view.servicePrice)}</DetailRow>
          <DetailRow label="Status"><StatusBadge value={view.status} /></DetailRow>
          <DetailRow label="Payment"><StatusBadge value={view.paymentStatus} /></DetailRow>
          <DetailRow label="Customer message">{view.message || "-"}</DetailRow>
          <DetailRow label="Requested on">{formatDate(view.createdAt)}</DetailRow>
        </Modal>
      )}
      {action && (
        <ConfirmDialog busy={busy} danger={action.type === "cancel"} onClose={() => setAction(null)} onConfirm={run}
          title={action.type === "confirm" ? "Confirm this appointment?" : "Cancel this appointment?"}
          confirmText={action.type === "confirm" ? "Confirm" : "Cancel appointment"}
          message={`${action.appt.customer.name} · ${action.appt.service.serviceName} · ${formatDate(action.appt.appointmentDate)} at ${action.appt.timeSlot}`} />
      )}
    </div>
  );
}
