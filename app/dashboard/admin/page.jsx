"use client";
import { CalendarCheck, CalendarClock, CalendarDays, CreditCard, Scissors, Users } from "lucide-react";
import { ErrorBox, PageLoader, StatCard } from "@/components/ui";
import { useFetch } from "@/hooks/useFetch";
import { api } from "@/lib/api";

export default function AdminOverview() {
  const { data, loading, error, reload } = useFetch(() => api("/stats/admin"), []);
  if (loading) return <PageLoader label="Loading dashboard…" />;
  if (error) return <ErrorBox message={error} onRetry={reload} />;
  return (
    <div>
      <h1 className="text-3xl font-semibold">Admin overview</h1>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard label="Registered customers" value={data.customers} icon={Users} />
        <StatCard label="Active services" value={data.services} icon={Scissors} tone="sage" />
        <StatCard label="Appointment requests" value={data.total} icon={CalendarDays} />
        <StatCard label="Pending appointments" value={data.pending} icon={CalendarClock} tone="amber" />
        <StatCard label="Confirmed appointments" value={data.confirmed} icon={CalendarCheck} tone="sage" />
        <StatCard label="Successful payments" value={data.payments} icon={CreditCard} />
      </div>
    </div>
  );
}
