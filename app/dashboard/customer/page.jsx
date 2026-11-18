"use client";
import Link from "next/link";
import { CalendarCheck, CalendarClock, CalendarDays, CalendarX } from "lucide-react";
import { ErrorBox, PageLoader, StatCard } from "@/components/ui";
import { useFetch } from "@/hooks/useFetch";
import { api } from "@/lib/api";

export default function CustomerOverview() {
  const { data, loading, error, reload } = useFetch(() => api("/stats/customer"), []);
  if (loading) return <PageLoader label="Loading your dashboard…" />;
  if (error) return <ErrorBox message={error} onRetry={reload} />;
  return (
    <div>
      <h1 className="text-3xl font-semibold">Overview</h1>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total requests" value={data.total} icon={CalendarDays} />
        <StatCard label="Pending" value={data.pending} icon={CalendarClock} tone="amber" />
        <StatCard label="Confirmed" value={data.confirmed} icon={CalendarCheck} tone="sage" />
        <StatCard label="Cancelled" value={data.cancelled} icon={CalendarX} tone="red" />
      </div>
      <div className="card mt-8 flex flex-col items-start gap-3 p-6">
        <h2 className="text-xl font-semibold">Ready for your next visit?</h2>
        <p className="text-sm text-ink-soft">Browse services, pick a time, and pay once your appointment is confirmed.</p>
        <Link href="/services" className="btn-primary">Browse services</Link>
      </div>
    </div>
  );
}
