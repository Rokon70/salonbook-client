"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { CalendarDays, CreditCard, LayoutDashboard, LogOut, Menu, Scissors, UserCircle, Users, X, ListChecks } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { Avatar } from "./Navbar";

const NAV = {
  customer: [
    { href: "/dashboard/customer", label: "Overview", icon: LayoutDashboard, exact: true },
    { href: "/dashboard/customer/appointments", label: "My Appointments", icon: CalendarDays },
    { href: "/dashboard/customer/payments", label: "Payment History", icon: CreditCard },
    { href: "/dashboard/customer/profile", label: "My Profile", icon: UserCircle },
  ],
  admin: [
    { href: "/dashboard/admin", label: "Overview", icon: LayoutDashboard, exact: true },
    { href: "/dashboard/admin/services", label: "Manage Services", icon: Scissors },
    { href: "/dashboard/admin/appointments", label: "Manage Appointments", icon: ListChecks },
    { href: "/dashboard/admin/users", label: "Manage Users", icon: Users },
    { href: "/dashboard/admin/transactions", label: "Transactions", icon: CreditCard },
    { href: "/dashboard/admin/profile", label: "My Profile", icon: UserCircle },
  ],
};

export default function DashboardShell({ user, children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const items = NAV[user.role] || NAV.customer;

  async function logout() {
    await authClient.signOut();
    toast.success("You have been logged out");
    router.push("/");
    router.refresh();
  }

  const sidebar = (
    <nav className="flex h-full flex-col">
      <div className="mb-6 flex items-center gap-3 px-2">
        <Avatar user={user} size="h-10 w-10" />
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">{user.name}</p>
          <p className="text-xs capitalize text-ink-faint">{user.role}</p>
        </div>
      </div>
      <ul className="space-y-1">
        {items.map(({ href, label, icon: Icon, exact }) => {
          const active = exact ? pathname === href : pathname.startsWith(href);
          return (
            <li key={href}>
              <Link href={href} onClick={() => setOpen(false)}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium ${active ? "bg-berry-600 text-white" : "text-ink-soft hover:bg-berry-50"}`}>
                <Icon className="h-4 w-4" />{label}
              </Link>
            </li>
          );
        })}
      </ul>
      <button onClick={logout} className="mt-auto flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50">
        <LogOut className="h-4 w-4" />Logout
      </button>
    </nav>
  );

  return (
    <div className="container-page flex gap-6 py-6">
      <aside className="card hidden min-h-[70vh] w-64 shrink-0 p-4 lg:block">{sidebar}</aside>

      <div className="min-w-0 flex-1">
        <button onClick={() => setOpen(true)} className="btn-outline mb-4 lg:hidden"><Menu className="h-4 w-4" />Menu</button>
        {children}
      </div>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden" onClick={() => setOpen(false)}>
          <div className="absolute inset-0 bg-ink/50" />
          <div className="absolute inset-y-0 left-0 w-72 bg-white p-4" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setOpen(false)} className="mb-2 ml-auto block rounded p-1" aria-label="Close menu"><X className="h-5 w-5" /></button>
            {sidebar}
          </div>
        </div>
      )}
    </div>
  );
}
