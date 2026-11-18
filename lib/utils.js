export const CATEGORIES = [
  "Haircut & Styling", "Hair Coloring", "Hair Treatment", "Facial & Skincare",
  "Makeup", "Manicure & Pedicure", "Spa & Massage",
];

export const money = (n, currency = "USD") =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: currency.toUpperCase() }).format(n || 0);

export const formatDate = (d) =>
  d ? new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "-";

export const shortId = (id = "") => (id.length > 14 ? `${id.slice(0, 10)}…${id.slice(-4)}` : id);
