"use client";
import { useRouter } from "next/navigation";
import { ShieldAlert } from "lucide-react";
import { authClient } from "@/lib/auth-client";

export default function BlockedPage() {
  const router = useRouter();
  return (
    <div className="container-page flex min-h-[60vh] flex-col items-center justify-center text-center">
      <ShieldAlert className="h-12 w-12 text-red-500" />
      <h1 className="mt-3 text-3xl font-semibold">Your account is blocked</h1>
      <p className="mt-2 max-w-md text-ink-soft">You cannot use appointments or payments right now. Please contact the salon if you think this is a mistake.</p>
      <button className="btn-primary mt-6" onClick={async () => { await authClient.signOut(); router.push("/"); router.refresh(); }}>Log out</button>
    </div>
  );
}
