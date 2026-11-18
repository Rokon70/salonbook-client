"use client";
import { useEffect } from "react";
import { Loader2, X, AlertCircle, Inbox } from "lucide-react";

export function Spinner({ className = "h-5 w-5" }) {
  return <Loader2 className={`animate-spin ${className}`} aria-hidden />;
}

export function PageLoader({ label = "Loading…" }) {
  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3 text-ink-soft" role="status">
      <Spinner className="h-8 w-8 text-berry-600" />
      <p className="text-sm">{label}</p>
    </div>
  );
}

export function ErrorBox({ message, onRetry }) {
  return (
    <div className="mx-auto my-10 max-w-md rounded-xl border border-red-200 bg-red-50 p-6 text-center">
      <AlertCircle className="mx-auto mb-2 h-8 w-8 text-red-500" />
      <p className="text-sm text-red-700">{message}</p>
      {onRetry && <button onClick={onRetry} className="btn-outline btn-sm mt-4">Try again</button>}
    </div>
  );
}

export function EmptyState({ title, text, action }) {
  return (
    <div className="flex flex-col items-center rounded-xl border border-dashed border-berry-200 bg-white px-6 py-14 text-center">
      <Inbox className="mb-3 h-9 w-9 text-berry-300" />
      <h3 className="text-lg font-semibold">{title}</h3>
      {text && <p className="mt-1 max-w-sm text-sm text-ink-soft">{text}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

const BADGES = {
  pending: "bg-amber-100 text-amber-800",
  confirmed: "bg-sage-100 text-sage-700",
  cancelled: "bg-red-100 text-red-700",
  unpaid: "bg-slate-100 text-slate-700",
  paid: "bg-emerald-100 text-emerald-800",
  failed: "bg-red-100 text-red-700",
  active: "bg-sage-100 text-sage-700",
  inactive: "bg-slate-100 text-slate-600",
  blocked: "bg-red-100 text-red-700",
};

export function StatusBadge({ value }) {
  return (
    <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${BADGES[value] || "bg-slate-100 text-slate-700"}`}>
      {value}
    </span>
  );
}

export function StatCard({ label, value, icon: Icon, tone = "berry" }) {
  const tones = { berry: "bg-berry-50 text-berry-600", sage: "bg-sage-50 text-sage-700", amber: "bg-amber-50 text-amber-700", red: "bg-red-50 text-red-600" };
  return (
    <div className="card flex items-center gap-4 p-5">
      {Icon && <span className={`rounded-lg p-3 ${tones[tone]}`}><Icon className="h-6 w-6" /></span>}
      <div>
        <p className="text-sm text-ink-soft">{label}</p>
        <p className="font-display text-3xl font-semibold">{value}</p>
      </div>
    </div>
  );
}

export function Modal({ title, onClose, children, wide }) {
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink/50 p-0 sm:items-center sm:p-4" onClick={onClose}>
      <div role="dialog" aria-modal="true" aria-label={title} onClick={(e) => e.stopPropagation()}
        className={`max-h-[90vh] w-full overflow-y-auto rounded-t-2xl bg-white p-6 sm:rounded-2xl ${wide ? "max-w-2xl" : "max-w-md"}`}>
        <div className="mb-4 flex items-start justify-between gap-4">
          <h2 className="text-xl font-semibold">{title}</h2>
          <button onClick={onClose} aria-label="Close" className="rounded p-1 text-ink-faint hover:bg-berry-50"><X className="h-5 w-5" /></button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function ConfirmDialog({ title, message, confirmText = "Confirm", danger, busy, onConfirm, onClose }) {
  return (
    <Modal title={title} onClose={busy ? () => {} : onClose}>
      <p className="text-sm text-ink-soft">{message}</p>
      <div className="mt-6 flex justify-end gap-3">
        <button className="btn-outline" onClick={onClose} disabled={busy}>Keep it</button>
        <button className={danger ? "btn-danger" : "btn-primary"} onClick={onConfirm} disabled={busy}>
          {busy && <Spinner className="h-4 w-4" />} {confirmText}
        </button>
      </div>
    </Modal>
  );
}

export function Field({ label, children }) {
  return <div><span className="label">{label}</span>{children}</div>;
}

export function DetailRow({ label, children }) {
  return (
    <div className="flex justify-between gap-4 border-b border-berry-50 py-2 text-sm last:border-0">
      <span className="text-ink-soft">{label}</span>
      <span className="text-right font-medium">{children}</span>
    </div>
  );
}
