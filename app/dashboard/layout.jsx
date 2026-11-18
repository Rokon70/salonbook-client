import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import DashboardShell from "@/components/DashboardShell";

export const metadata = { title: "Dashboard" };

// Runs on the server on every request, so it also works after a page refresh.
export default async function DashboardLayout({ children }) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/signin?next=/dashboard");
  if (session.user.isBlocked) redirect("/blocked");

  const { name, email, image, role } = session.user;
  return <DashboardShell user={{ name, email, image: image || "", role: role || "customer" }}>{children}</DashboardShell>;
}
