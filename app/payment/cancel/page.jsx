import Link from "next/link";
import { XCircle } from "lucide-react";

export const metadata = { title: "Payment cancelled" };

export default function PaymentCancelPage() {
  return (
    <div className="container-page flex min-h-[60vh] flex-col items-center justify-center text-center">
      <XCircle className="h-14 w-14 text-red-400" />
      <h1 className="mt-4 text-3xl font-semibold">Payment cancelled</h1>
      <p className="mt-2 max-w-md text-ink-soft">No money was taken. Your appointment is still confirmed, and you can pay whenever you are ready.</p>
      <Link href="/dashboard/customer/appointments" className="btn-primary mt-6">Back to My Appointments</Link>
    </div>
  );
}
