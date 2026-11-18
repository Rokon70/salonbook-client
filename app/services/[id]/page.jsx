"use client";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { CalendarPlus, Clock, ShieldAlert } from "lucide-react";
import { ErrorBox, PageLoader, Spinner } from "@/components/ui";
import { useFetch } from "@/hooks/useFetch";
import { api } from "@/lib/api";
import { authClient } from "@/lib/auth-client";
import { money } from "@/lib/utils";

export default function ServiceDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const { data, loading, error, reload } = useFetch(() => api(`/services/${id}`), [id]);
  const [showForm, setShowForm] = useState(false);

  if (loading) return <PageLoader label="Loading service…" />;
  if (error) return (
    <div className="container-page py-10">
      <ErrorBox message={error} onRetry={reload} />
      <div className="text-center"><Link href="/services" className="btn-outline">Back to services</Link></div>
    </div>
  );

  const s = data.service;
  const isAdmin = session?.user?.role === "admin";
  const bookable = s.status === "active";

  return (
    <div className="container-page py-10">
      <Link href="/services" className="text-sm text-berry-700 hover:underline">← Back to services</Link>
      <div className="mt-4 grid gap-10 lg:grid-cols-2">
        <div className="overflow-hidden rounded-2xl bg-berry-50">
          {s.image && /* eslint-disable-next-line @next/next/no-img-element */ <img src={s.image} alt={s.serviceName} className="aspect-[4/3] w-full object-cover" />}
        </div>
        <div>
          <p className="text-sm font-medium text-sage-700">{s.category}</p>
          <h1 className="mt-1 text-4xl font-semibold">{s.serviceName}</h1>
          <p className="mt-4 whitespace-pre-line leading-relaxed text-ink-soft">{s.description}</p>
          <div className="mt-6 flex items-center gap-6">
            <span className="font-display text-3xl font-semibold text-berry-700">{money(s.price)}</span>
            <span className="flex items-center gap-1.5 text-ink-soft"><Clock className="h-4 w-4" />About {s.duration} minutes</span>
          </div>

          {!bookable && <p className="mt-6 rounded-lg bg-amber-50 p-3 text-sm text-amber-800">This service is inactive and cannot be booked.</p>}
          {isAdmin && (
            <p className="mt-6 flex gap-2 rounded-lg bg-berry-50 p-3 text-sm text-berry-800"><ShieldAlert className="h-5 w-5 shrink-0" />Admins cannot submit customer appointment requests.</p>
          )}
          {bookable && !isAdmin && !showForm && (
            <button className="btn-primary mt-6" onClick={() => setShowForm(true)}><CalendarPlus className="h-4 w-4" />Book appointment</button>
          )}
          {bookable && !isAdmin && showForm && <BookingForm serviceId={s._id} onDone={() => router.push("/dashboard/customer/appointments")} />}
        </div>
      </div>
    </div>
  );
}

function BookingForm({ serviceId, onDone }) {
  const today = new Date().toISOString().slice(0, 10);
  const [date, setDate] = useState("");
  const [slot, setSlot] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const slots = useFetch(() => (date ? api(`/appointments/slots?serviceId=${serviceId}&date=${date}`) : Promise.resolve(null)), [date, serviceId]);

  async function submit(e) {
    e.preventDefault();
    if (!date) return toast.error("Choose an appointment date");
    if (!slot) return toast.error("Choose a time slot");
    setBusy(true);
    try {
      const res = await api("/appointments", { method: "POST", body: { serviceId, appointmentDate: date, timeSlot: slot, message } });
      toast.success(res.message);
      onDone();
    } catch (err) {
      toast.error(err.message);
      slots.reload(); // refresh taken slots after a booking conflict
      setSlot("");
    } finally { setBusy(false); }
  }

  return (
    <form onSubmit={submit} className="card mt-6 space-y-4 p-5">
      <h2 className="text-xl font-semibold">Request an appointment</h2>
      <div>
        <label className="label" htmlFor="date">Appointment date</label>
        <input id="date" type="date" min={today} className="input" value={date} onChange={(e) => { setDate(e.target.value); setSlot(""); }} />
      </div>
      <div>
        <span className="label">Available time slot</span>
        {!date ? <p className="text-sm text-ink-faint">Pick a date to see time slots.</p> : slots.loading ? <Spinner className="h-5 w-5 text-berry-600" /> : slots.error ? (
          <p className="text-sm text-red-600">{slots.error}</p>
        ) : (
          <div className="grid grid-cols-3 gap-2">
            {slots.data.slots.map((t) => {
              const taken = slots.data.taken.includes(t);
              return (
                <button type="button" key={t} disabled={taken} onClick={() => setSlot(t)}
                  className={`rounded-lg border px-2 py-2 text-xs font-medium ${taken ? "cursor-not-allowed border-slate-200 bg-slate-50 text-slate-400 line-through" : slot === t ? "border-berry-600 bg-berry-600 text-white" : "border-berry-200 hover:bg-berry-50"}`}>
                  {t}
                </button>
              );
            })}
          </div>
        )}
      </div>
      <div>
        <label className="label" htmlFor="msg">Additional message (optional)</label>
        <textarea id="msg" rows={3} maxLength={500} className="input" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Anything we should know?" />
      </div>
      <button className="btn-primary w-full" disabled={busy}>{busy && <Spinner className="h-4 w-4" />}Submit request</button>
    </form>
  );
}
