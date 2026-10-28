"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { DUMMY_HASH, findUserByPhone } from "@/lib/users";
import { createSession, deleteSession, getSession } from "@/lib/session";
import { safeNext } from "@/lib/safe-next";
import { cancelOrderFor, createOrder, setOrderStatusAsStaff } from "@/lib/orders";
import {
  OrderIdSchema, OrderStatusSchema, PlaceOrderSchema, SignInSchema, zodFieldErrors,
} from "@/lib/schemas";


export type SignInState = {
  error?: string;
  fieldErrors?: Record<string, string>;
  phone?: string;
};

export async function signIn(_prev: SignInState, formData: FormData): Promise<SignInState> {
  const parsed = SignInSchema.safeParse({
    phone: String(formData.get("phone") ?? ""),
    password: String(formData.get("password") ?? ""),
  });
  if (!parsed.success) {
    return { fieldErrors: zodFieldErrors(parsed.error), phone: String(formData.get("phone") ?? "") };
  }

  const { phone, password } = parsed.data;
  const user = findUserByPhone(phone);
  const passwordOk = await bcrypt.compare(password, user?.passwordHash ?? DUMMY_HASH);
  if (!user || !passwordOk) return { error: "Wrong phone number or password.", phone };

  await createSession(user.id);
  redirect(safeNext(formData.get("next")));
}

export async function signOut() {
  await deleteSession();
  redirect("/");
}

/* ---------------- Orders (Day 40) ---------------- */

export type PlaceOrderState = {
  error?: string;
  fieldErrors?: Record<string, string>;
  values?: { name: string; phone: string; note: string };
  orderId?: string;
};

export async function placeOrder(_prev: PlaceOrderState, formData: FormData): Promise<PlaceOrderState> {
  // Check 1: who is asking? (A server action is a public endpoint.)
  const user = await getSession();
  if (!user) redirect(`/signin?next=${encodeURIComponent("/checkout")}`);

  const values = {
    name: String(formData.get("name") ?? ""),
    phone: String(formData.get("phone") ?? ""),
    note: String(formData.get("note") ?? ""),
  };

  let items: unknown = [];
  try { items = JSON.parse(String(formData.get("items") ?? "[]")); } catch { items = []; }

  // Check 2: is the input valid? The same schema as /api/orders.
  const parsed = PlaceOrderSchema.safeParse({ ...values, items });
  if (!parsed.success) return { fieldErrors: zodFieldErrors(parsed.error), values };

  // Check 3: the owner comes from the session; the prices come from our data.
  const result = createOrder(user.id, parsed.data);
  if (!result.ok) return { error: result.error, values };

  revalidatePath("/orders");
  return { orderId: result.order.id };
}

// Bound to a form: <form action={cancelOrder.bind(null, order.id)}>
export async function cancelOrder(orderId: string): Promise<void> {
  const user = await getSession(); // authentication
  if (!user) throw new Error("Not signed in");

  const id = OrderIdSchema.safeParse(orderId); // never trust an id from the client
  if (!id.success) throw new Error("Invalid order id");

  // Authorisation: the lookup includes the owner, so another person's order is "not found".
  const result = cancelOrderFor(user.id, id.data);
  if (result === "not_found") throw new Error("No such order");
  if (result === "too_late") throw new Error("This order can no longer be cancelled");

  revalidatePath("/orders");
  revalidatePath(`/orders/${id.data}`);
}

// Staff only: <form action={updateOrderStatus.bind(null, order.id, "preparing")}>
export async function updateOrderStatus(orderId: string, status: string): Promise<void> {
  const user = await getSession();
  if (!user) throw new Error("Not signed in");
  if (user.role !== "staff") throw new Error("Not allowed"); // role from the server's record, not the UI

  const id = OrderIdSchema.safeParse(orderId);
  const next = OrderStatusSchema.safeParse(status);
  if (!id.success || !next.success) throw new Error("Invalid input");

  const result = setOrderStatusAsStaff(user, id.data, next.data);
  if (result === "not_found") throw new Error("No such order");
  if (result === "bad_transition") throw new Error("That status change is not allowed");

  revalidatePath("/kitchen");
  revalidatePath("/orders");
}