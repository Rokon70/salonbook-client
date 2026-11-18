"use client";
import { EmptyState, ErrorBox, PageLoader, StatusBadge } from "@/components/ui";
import { useFetch } from "@/hooks/useFetch";
import { api } from "@/lib/api";
import { formatDate, money, shortId } from "@/lib/utils";

export default function Transactions() {
  const { data, loading, error, reload } = useFetch(() => api("/payments/transactions"), []);
  if (loading) return <PageLoader label="Loading transactions…" />;
  if (error) return <ErrorBox message={error} onRetry={reload} />;
  return (
    <div>
      <h1 className="text-3xl font-semibold">Transactions</h1>
      <p className="mt-1 text-sm text-ink-soft">Payments are recorded automatically from Stripe and cannot be edited.</p>
      {data.transactions.length === 0 ? <div className="mt-6"><EmptyState title="No transactions yet" text="Paid appointments will appear here." /></div> : (
        <div className="card mt-6 overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead className="border-b border-berry-100 bg-berry-50/50"><tr>{["Customer", "Service", "Appointment", "Amount", "Currency", "Stripe session", "Status", "Date"].map((h) => <th key={h} className="th">{h}</th>)}</tr></thead>
            <tbody className="divide-y divide-berry-50">
              {data.transactions.map((t) => (
                <tr key={t._id}>
                  <td className="td"><p className="font-medium">{t.customer.name}</p><p className="text-xs text-ink-faint">{t.customer.email}</p></td>
                  <td className="td">{t.serviceName}</td>
                  <td className="td">{t.appointmentDate === "-" ? "-" : formatDate(t.appointmentDate)}</td>
                  <td className="td font-medium">{money(t.amount, t.currency)}</td>
                  <td className="td uppercase">{t.currency}</td>
                  <td className="td font-mono text-xs" title={t.stripeSessionId}>{shortId(t.stripeSessionId)}</td>
                  <td className="td"><StatusBadge value={t.status} /></td>
                  <td className="td text-ink-soft">{formatDate(t.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
