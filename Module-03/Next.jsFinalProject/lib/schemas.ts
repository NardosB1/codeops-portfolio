// Pure module (no server-only): safe for client components to import types and constants from.
import { z } from "zod";

export const PHONE_RE = /^09\d{8}$/;

export const SignInSchema = z.object({
  phone: z.string().trim().regex(PHONE_RE, "Enter a phone number like 0911000001."),
  password: z.string().min(1, "Enter your password.").max(200, "Password is too long."),
});

// One schema for the form action AND the /api/orders handler.
export const PlaceOrderSchema = z.object({
  name: z.string().trim().min(2, "Enter your name.").max(60, "Name is too long."),
  phone: z.string().trim().regex(PHONE_RE, "Enter a phone number like 0911000001."),
  note: z.string().trim().max(200, "Keep the note under 200 characters.").default(""),
  // Only ids and quantities. Prices are looked up on the server, never read from the client.
  items: z
    .array(
      z.object({
        dishId: z.string().min(1).max(60),
        qty: z.number().int().min(1).max(20),
      }),
    )
    .min(1, "Your cart is empty.")
    .max(30, "Too many items."),
});
export type PlaceOrderInput = z.infer<typeof PlaceOrderSchema>;

export const OrderIdSchema = z.string().regex(/^ord_\d{1,10}$/, "Invalid order id.");

export const OrderStatusSchema = z.enum(["received", "preparing", "ready", "delivered", "cancelled"]);
export type OrderStatus = z.infer<typeof OrderStatusSchema>;

// Statuses that can never change again: the live status poll stops on these.
export const TERMINAL_STATUSES: readonly OrderStatus[] = ["delivered", "cancelled"];

// First message per top-level field, e.g. { phone: "Enter a phone number…" }
export function zodFieldErrors(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    out[String(issue.path[0] ?? "form")] ??= issue.message;
  }
  return out;
}
