"use client";
import { useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { CreditCard, Eye, XCircle } from "lucide-react";
import { ConfirmDialog, DetailRow, EmptyState, ErrorBox, Modal, PageLoader, Spinner, StatusBadge } from "@/components/ui";
import { useFetch } from "@/hooks/useFetch";
import { api } from "@/lib/api";
import { formatDate, money } from "@/lib/utils";

export default function MyAppointments() {
  const { data, loading, error, reload } = useFetch(() => api("/appointments/mine"), []);
  const [view, setView] = useState(null);
  const [cancel, setCancel] = useState(null);
  const [busy, setBusy] = useState(false);
  const [payingId, setPayingId] = useState(null);

  async function doCancel() {
    setBusy(true);
    try {
      const res = await api(`/appointments/${cancel._id}/cancel`, { method: "PATCH" });
      toast.success(res.message);
      setCancel(null);
      reload();
    } catch (err) { toast.error(err.message); } finally { setBusy(false); }
  }

  async function pay(a) {
    setPayingId(a._id);
    try {
      const { url } = await api(`/payments/checkout/${a._id}`, { method: "POST" });
      window.location.href = url; // Stripe Checkout
    } catch (err) { toast.error(err.message); setPayingId(null); }
  }

  if (loading) return <PageLoader label="Loading your appointments…" />;
  if (error) return <ErrorBox message={error} onRetry={reload} />;

  return (
    <div>
      <h1 className="text-3xl font-semibold">My appointments</h1>
      {data.appointments.length === 0 ? (
        <div className="mt-6"><EmptyState title="No appointments yet" text="Choose a service and send your first request."
          action={<Link href="/services" className="btn-primary">Browse services</Link>} /></div>
      ) : (
        <div className="card mt-6 overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead className="border-b border-berry-100 bg-berry-50/50">
              <tr>{["Service", "Date & time", "Price", "Status", "Payment", "Requested", "Actions"].map((h) => <th key={h} className="th">{h}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-berry-50">
              {data.appointments.map((a) => (
                <tr key={a._id}>
                  <td className="td">
                    <div className="flex items-center gap-3">
                      {a.service.image && /* eslint-disable-next-line @next/next/no-img-element */ <img src={a.service.image} alt="" className="h-12 w-12 rounded-lg object-cover" />}
                      <div><p className="font-medium">{a.service.serviceName}</p><p className="text-xs text-ink-faint">{a.service.category}</p></div>
                    </div>
                  </td>
                  <td className="td">{formatDate(a.appointmentDate)}<br /><span className="text-xs text-ink-faint">{a.timeSlot}</span></td>
                  <td className="td font-medium">{money(a.servicePrice)}</td>
                  <td className="td"><StatusBadge value={a.status} /></td>
                  <td className="td"><StatusBadge value={a.paymentStatus} /></td>
                  <td className="td text-ink-soft">{formatDate(a.createdAt)}</td>
                  <td className="td">
                    <div className="flex flex-wrap gap-2">
                      <button className="btn-outline btn-sm" onClick={() => setView(a)}><Eye className="h-3.5 w-3.5" />Details</button>
                      {a.status === "pending" && <button className="btn-outline btn-sm text-red-600" onClick={() => setCancel(a)}><XCircle className="h-3.5 w-3.5" />Cancel</button>}
                      {a.status === "confirmed" && a.paymentStatus === "unpaid" && (
                        <button className="btn-primary btn-sm" onClick={() => pay(a)} disabled={payingId === a._id}>
                          {payingId === a._id ? <Spinner className="h-3.5 w-3.5" /> : <CreditCard className="h-3.5 w-3.5" />}Pay now
                        </button>
                      )}
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
          <DetailRow label="Service">{view.service.serviceName}</DetailRow>
          <DetailRow label="Category">{view.service.category}</DetailRow>
          <DetailRow label="Date">{formatDate(view.appointmentDate)}</DetailRow>
          <DetailRow label="Time">{view.timeSlot}</DetailRow>
          <DetailRow label="Price">{money(view.servicePrice)}</DetailRow>
          <DetailRow label="Status"><StatusBadge value={view.status} /></DetailRow>
          <DetailRow label="Payment"><StatusBadge value={view.paymentStatus} /></DetailRow>
          <DetailRow label="Your message">{view.message || "-"}</DetailRow>
          <DetailRow label="Requested on">{formatDate(view.createdAt)}</DetailRow>
        </Modal>
      )}
      {cancel && (
        <ConfirmDialog title="Cancel this request?" danger busy={busy} confirmText="Cancel request" onClose={() => setCancel(null)} onConfirm={doCancel}
          message={`Your request for ${cancel.service.serviceName} on ${formatDate(cancel.appointmentDate)} at ${cancel.timeSlot} will be cancelled.`} />
      )}
    </div>
  );
}
