import Link from "next/link";
import { Clock, Facebook, Instagram, Mail, MapPin, Phone, Scissors, Twitter } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-20 bg-ink text-berry-100">
      <div className="container-page grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="flex items-center gap-2 font-display text-2xl text-white"><Scissors className="h-6 w-6" />SalonBook</p>
          <p className="mt-3 text-sm text-berry-200/80">Hair, skin, nails and calm. Pick a service, choose a time and we will take care of the rest.</p>
          <div className="mt-4 flex gap-3">
            <a href="https://facebook.com" aria-label="Facebook" className="rounded-full bg-white/10 p-2 hover:bg-white/20"><Facebook className="h-4 w-4" /></a>
            <a href="https://instagram.com" aria-label="Instagram" className="rounded-full bg-white/10 p-2 hover:bg-white/20"><Instagram className="h-4 w-4" /></a>
            <a href="https://twitter.com" aria-label="Twitter" className="rounded-full bg-white/10 p-2 hover:bg-white/20"><Twitter className="h-4 w-4" /></a>
          </div>
        </div>
        <div>
          <h3 className="font-sans text-sm font-semibold text-white">Quick links</h3>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link href="/" className="hover:text-white">Home</Link></li>
            <li><Link href="/services" className="hover:text-white">Browse Services</Link></li>
            <li><Link href="/signin" className="hover:text-white">Sign In</Link></li>
            <li><Link href="/signup" className="hover:text-white">Sign Up</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="font-sans text-sm font-semibold text-white">Contact</h3>
          <ul className="mt-3 space-y-2 text-sm">
            <li className="flex gap-2"><Phone className="mt-0.5 h-4 w-4 shrink-0" />+880 1700-000000</li>
            <li className="flex gap-2"><Mail className="mt-0.5 h-4 w-4 shrink-0" />hello@salonbook.com</li>
            <li className="flex gap-2"><MapPin className="mt-0.5 h-4 w-4 shrink-0" />House 12, Road 5, Dhanmondi, Dhaka 1209</li>
          </ul>
        </div>
        <div>
          <h3 className="font-sans text-sm font-semibold text-white">Opening hours</h3>
          <ul className="mt-3 space-y-2 text-sm">
            <li className="flex gap-2"><Clock className="mt-0.5 h-4 w-4 shrink-0" />Sat – Thu: 9:00 AM – 7:00 PM</li>
            <li className="pl-6">Friday: 3:00 PM – 8:00 PM</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs text-berry-200/70">
        © {new Date().getFullYear()} SalonBook. All rights reserved.
      </div>
    </footer>
  );
}
