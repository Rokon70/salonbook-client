import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

// Blocks access to the other role's dashboard even if the URL is typed manually.
export default async function CustomerLayout({ children }) {
  const session = await auth.api.getSession({ headers: await headers(), query: { disableCookieCache: true } });
  if (!session) redirect("/signin");
  if ((session.user.role || "customer") !== "customer") redirect("/dashboard");
  return children;
}
