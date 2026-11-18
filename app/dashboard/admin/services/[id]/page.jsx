"use client";
import { useParams } from "next/navigation";
import ServiceForm from "@/components/ServiceForm";
import { ErrorBox, PageLoader } from "@/components/ui";
import { useFetch } from "@/hooks/useFetch";
import { api } from "@/lib/api";

export default function EditServicePage() {
  const { id } = useParams();
  const { data, loading, error, reload } = useFetch(() => api(`/services/${id}`), [id]);
  if (loading) return <PageLoader label="Loading service…" />;
  if (error) return <ErrorBox message={error} onRetry={reload} />;
  return (<div><h1 className="mb-6 text-3xl font-semibold">Update service</h1><ServiceForm service={data.service} /></div>);
}
