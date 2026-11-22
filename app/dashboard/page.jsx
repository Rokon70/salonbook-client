import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

// Sends each role to its own dashboard
export default async function DashboardIndex() {
  const session = await auth.api.getSession({ headers: await headers(), query: { disableCookieCache: true } });
  if (!session) redirect("/signin");
  redirect(session.user.role === "admin" ? "/dashboard/admin" : "/dashboard/customer");
}
