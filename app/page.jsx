"use client";
import Link from "next/link";
import { CalendarCheck, CreditCard, Droplets, Flower2, Hand, Paintbrush, Scissors, Smile, Sparkles, ClipboardCheck } from "lucide-react";
import ServiceCard from "@/components/ServiceCard";
import { ErrorBox, PageLoader } from "@/components/ui";
import { useFetch } from "@/hooks/useFetch";
import { api } from "@/lib/api";

const HERO = "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1800&q=80";
const ICONS = {
  "Haircut & Styling": Scissors, "Hair Coloring": Paintbrush, "Hair Treatment": Droplets, "Facial & Skincare": Smile,
  "Makeup": Sparkles, "Manicure & Pedicure": Hand, "Spa & Massage": Flower2,
};

export default function HomePage() {
  const featured = useFetch(() => api("/services?limit=6", { auth: false }), []);
  const cats = useFetch(() => api("/services/categories", { auth: false }), []);

  return (
    <>
      {/* Banner */}
      <section className="relative isolate overflow-hidden bg-ink text-white">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={HERO} alt="" className="absolute inset-0 -z-10 h-full w-full object-cover opacity-45" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-ink via-ink/70 to-transparent" />
        <div className="container-page py-24 sm:py-32">
          <h1 className="max-w-2xl text-4xl font-semibold leading-tight sm:text-6xl">Your next appointment, booked in a minute.</h1>
          <p className="mt-5 max-w-xl text-lg text-berry-100/90">
            Browse haircuts, colour, skincare, nails and spa treatments. Pick a day and time, and pay online once we confirm.
          </p>
          <Link href="/services" className="btn mt-8 bg-white px-6 py-3 text-base text-berry-700 hover:bg-berry-50">Explore Salon Services</Link>
        </div>
      </section>

      {/* Featured services */}
      <section className="container-page mt-16">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-semibold">Featured services</h2>
            <p className="mt-1 text-ink-soft">A few favourites from our menu.</p>
          </div>
          <Link href="/services" className="btn-outline hidden sm:inline-flex">View all</Link>
        </div>
        {featured.loading ? <PageLoader label="Loading services…" /> : featured.error ? (
          <ErrorBox message={featured.error} onRetry={featured.reload} />
        ) : featured.data.services.length === 0 ? (
          <p className="rounded-xl border border-dashed border-berry-200 p-10 text-center text-ink-soft">No services are available yet. Please check back soon.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.data.services.map((s) => <ServiceCard key={s._id} service={s} />)}
          </div>
        )}
      </section>

      {/* Categories */}
      <section className="container-page mt-20">
        <h2 className="text-3xl font-semibold">Find a service by category</h2>
        <p className="mt-1 text-ink-soft">Choose what you need and we will show matching services.</p>
        <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
          {(cats.data?.categories || Object.keys(ICONS).map((name) => ({ name, count: null }))).map((c) => {
            const Icon = ICONS[c.name] || Scissors;
            return (
              <Link key={c.name} href={`/services?category=${encodeURIComponent(c.name)}`}
                className="card group flex flex-col items-start gap-3 p-5 hover:border-berry-300">
                <span className="rounded-lg bg-berry-50 p-3 text-berry-600 group-hover:bg-berry-100"><Icon className="h-6 w-6" /></span>
                <span className="font-semibold leading-snug">{c.name}</span>
                {c.count !== null && <span className="text-xs text-ink-soft">{c.count} {c.count === 1 ? "service" : "services"}</span>}
              </Link>
            );
          })}
        </div>
      </section>

      {/* How booking works (extra section) */}
      <section className="container-page mt-20">
        <div className="rounded-2xl bg-sage-50 p-8 sm:p-12">
          <h2 className="text-3xl font-semibold">How booking works</h2>
          <ol className="mt-8 grid gap-8 md:grid-cols-3">
            {[
              [ClipboardCheck, "Request a time", "Pick a service, a date and a time slot. Your request starts as pending."],
              [CalendarCheck, "We confirm it", "The salon reviews your request and confirms it, usually within a few hours."],
              [CreditCard, "Pay securely", "Once confirmed, pay online with Stripe from your dashboard. No payment is taken before that."],
            ].map(([Icon, title, text], i) => (
              <li key={title} className="flex gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white font-display text-lg font-semibold text-sage-700">{i + 1}</span>
                <div>
                  <h3 className="flex items-center gap-2 text-lg font-semibold"><Icon className="h-5 w-5 text-sage-700" />{title}</h3>
                  <p className="mt-1 text-sm text-ink-soft">{text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </>
  );
}
