"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { Spinner } from "@/components/ui";
import { api } from "@/lib/api";
import { money } from "@/lib/utils";
import { Suspense } from "react";

function Success() {
  const sessionId = useSearchParams().get("session_id");
  const [state, setState] = useState({ status: "processing" });

  // The webhook (not this page) marks the payment as paid. We only poll until it has done so.
  useEffect(() => {
    if (!sessionId) return;
    let tries = 0;
    let stop = false;
    async function poll() {
      try {
        const res = await api(`/payments/session/${sessionId}`);
        if (stop) return;
        setState(res);
        if (res.status === "processing" && ++tries < 15) setTimeout(poll, 2000);
        else if (res.status === "processing") setState({ status: "slow" });
      } catch { if (!stop) setState({ status: "error" }); }
    }
    poll();
    return () => { stop = true; };
  }, [sessionId]);

  const paid = state.status === "paid";
  return (
    <div className="container-page flex min-h-[60vh] flex-col items-center justify-center text-center">
      {paid ? <CheckCircle2 className="h-14 w-14 text-sage-500" /> : state.status === "error" ? null : <Spinner className="h-10 w-10 text-berry-600" />}
      <h1 className="mt-4 text-3xl font-semibold">
        {paid ? "Payment received" : state.status === "error" ? "We could not check your payment" : "Confirming your payment…"}
      </h1>
      <p className="mt-2 max-w-md text-ink-soft">
        {paid ? `Thank you! We received ${money(state.amount, state.currency)}. Your appointment is paid.`
          : state.status === "slow" ? "Stripe is taking longer than usual. Your payment will show as Paid in My Appointments shortly."
          : state.status === "error" ? "Please open My Appointments to see the latest status."
          : "This usually takes a few seconds. Please do not close this page."}
      </p>
      <Link href="/dashboard/customer/appointments" className="btn-primary mt-6">Go to My Appointments</Link>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return <Suspense><Success /></Suspense>;
}
