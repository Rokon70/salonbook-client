"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import ServiceCard from "@/components/ServiceCard";
import { EmptyState, ErrorBox, PageLoader } from "@/components/ui";
import { useFetch } from "@/hooks/useFetch";
import { api } from "@/lib/api";
import { CATEGORIES } from "@/lib/utils";

export default function BrowseServices() {
  const params = useSearchParams();
  const [search, setSearch] = useState("");
  const [debounced, setDebounced] = useState("");
  const [category, setCategory] = useState(params.get("category") || "");
  const [sort, setSort] = useState("");

  useEffect(() => {
    const t = setTimeout(() => setDebounced(search.trim()), 350);
    return () => clearTimeout(t);
  }, [search]);

  const { data, loading, error, reload } = useFetch(() => {
    const q = new URLSearchParams({ limit: "50" });
    if (debounced) q.set("search", debounced);
    if (category) q.set("category", category);
    if (sort) q.set("sort", sort);
    return api(`/services?${q}`, { auth: false });
  }, [debounced, category, sort]);

  const reset = () => { setSearch(""); setCategory(""); setSort(""); };

  return (
    <div className="container-page py-10">
      <h1 className="text-4xl font-semibold">Browse services</h1>
      <p className="mt-1 text-ink-soft">Search by name, filter by category or sort by price.</p>

      <div className="mt-8 grid gap-3 md:grid-cols-[1fr_220px_200px]">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-faint" />
          <input className="input pl-9" placeholder="Search services by name" value={search} onChange={(e) => setSearch(e.target.value)} aria-label="Search services" />
        </div>
        <select className="input" value={category} onChange={(e) => setCategory(e.target.value)} aria-label="Filter by category">
          <option value="">All categories</option>
          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <select className="input" value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort by price">
          <option value="">Newest first</option>
          <option value="price_asc">Price: low to high</option>
          <option value="price_desc">Price: high to low</option>
        </select>
      </div>

      <div className="mt-8">
        {loading ? <PageLoader label="Loading services…" /> : error ? <ErrorBox message={error} onRetry={reload} /> :
          data.services.length === 0 ? (
            <EmptyState title="No services match your search" text="Try a different name or clear the filters."
              action={<button onClick={reset} className="btn-outline">Clear filters</button>} />
          ) : (
            <>
              <p className="mb-4 text-sm text-ink-soft">{data.total} {data.total === 1 ? "service" : "services"} found</p>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {data.services.map((s) => <ServiceCard key={s._id} service={s} />)}
              </div>
            </>
          )}
      </div>
    </div>
  );
}
