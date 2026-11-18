"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { ChevronDown, LayoutDashboard, LogOut, Menu, Scissors, X } from "lucide-react";
import { authClient } from "@/lib/auth-client";

export default function Navbar() {
  const { data: session, isPending } = authClient.useSession();
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [menu, setMenu] = useState(false);
  const ref = useRef(null);
  const user = session?.user;

  useEffect(() => { setOpen(false); setMenu(false); }, [pathname]);
  useEffect(() => {
    const close = (e) => ref.current && !ref.current.contains(e.target) && setMenu(false);
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  async function logout() {
    await authClient.signOut();
    toast.success("You have been logged out");
    router.push("/");
    router.refresh();
  }

  const link = (href, label) => (
    <Link href={href} className={`rounded-md px-3 py-2 text-sm font-medium ${pathname === href ? "text-berry-700" : "text-ink-soft hover:text-berry-700"}`}>{label}</Link>
  );

  return (
    <header className="sticky top-0 z-40 border-b border-berry-100 bg-paper/95 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-display text-2xl font-semibold text-berry-700">
          <Scissors className="h-6 w-6" /> SalonBook
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {link("/", "Home")}
          {link("/services", "Browse Services")}
          {user && link("/dashboard", "Dashboard")}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {isPending ? (
            <div className="h-9 w-24 animate-pulse rounded-lg bg-berry-50" />
          ) : user ? (
            <div className="relative" ref={ref}>
              <button onClick={() => setMenu(!menu)} className="flex items-center gap-2 rounded-full border border-berry-100 bg-white py-1 pl-1 pr-3" aria-expanded={menu}>
                <Avatar user={user} />
                <span className="max-w-[120px] truncate text-sm font-medium">{user.name}</span>
                <ChevronDown className="h-4 w-4 text-ink-faint" />
              </button>
              {menu && (
                <div className="absolute right-0 mt-2 w-52 rounded-xl border border-berry-100 bg-white p-2 shadow-lg">
                  <p className="truncate px-3 py-2 text-sm font-semibold">{user.name}</p>
                  <Link href="/dashboard" className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-berry-50"><LayoutDashboard className="h-4 w-4" />Dashboard</Link>
                  <button onClick={logout} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-600 hover:bg-red-50"><LogOut className="h-4 w-4" />Logout</button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link href="/signin" className="btn-outline">Sign In</Link>
              <Link href="/signup" className="btn-primary">Sign Up</Link>
            </>
          )}
        </div>

        <button className="rounded-md p-2 md:hidden" onClick={() => setOpen(!open)} aria-label="Toggle menu">
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {open && (
        <div className="border-t border-berry-100 bg-white px-4 py-3 md:hidden">
          <div className="flex flex-col gap-1">
            {link("/", "Home")}
            {link("/services", "Browse Services")}
            {user ? (
              <>
                {link("/dashboard", "Dashboard")}
                <p className="px-3 pt-2 text-xs text-ink-faint">Signed in as {user.name}</p>
                <button onClick={logout} className="btn-outline mt-1">Logout</button>
              </>
            ) : (
              <div className="mt-2 flex gap-2">
                <Link href="/signin" className="btn-outline flex-1">Sign In</Link>
                <Link href="/signup" className="btn-primary flex-1">Sign Up</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

export function Avatar({ user, size = "h-8 w-8" }) {
  return user?.image ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={user.image} alt="" className={`${size} rounded-full object-cover`} referrerPolicy="no-referrer" />
  ) : (
    <span className={`${size} flex items-center justify-center rounded-full bg-berry-100 text-sm font-semibold text-berry-700`}>
      {user?.name?.[0]?.toUpperCase() || "?"}
    </span>
  );
}
