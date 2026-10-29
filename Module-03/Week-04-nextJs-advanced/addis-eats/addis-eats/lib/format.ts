import type { OrderStatus } from "./schemas";

export const formatEtb = (n: number) => `ETB ${n.toLocaleString("en-US")}`;

// Explicit locale and time zone so server output never depends on the host machine.
export const formatDate = (iso: string) =>
  new Date(iso).toLocaleString("en-GB", {
    timeZone: "Africa/Addis_Ababa",
    dateStyle: "medium",
    timeStyle: "short",
  });

// Status is always shown as text too, never by colour alone.
export function statusBadgeClass(status: OrderStatus): string {
  switch (status) {
    case "received":
      return "bg-honey-100 text-honey-900";
    case "preparing":
      return "bg-lake-100 text-lake-800";
    case "ready":
      return "bg-emerald-100 text-emerald-900";
    case "delivered":
      return "bg-gray-200 text-gray-900";
    case "cancelled":
      return "bg-red-100 text-red-900";
  }
}