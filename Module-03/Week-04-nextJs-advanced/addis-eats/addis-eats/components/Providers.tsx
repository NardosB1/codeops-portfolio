"use client"; // cart state lives in the browser (localStorage)

import { createContext, useContext, useMemo, useSyncExternalStore, type ReactNode } from "react";

export type CartLine = { dishId: string; name: string; priceEtb: number; qty: number };

const STORAGE_KEY = "addis-eats-cart-v1";
const MAX_QTY = 20;
const clampQty = (n: number) => Math.max(1, Math.min(Math.trunc(n), MAX_QTY));

/* ---- A tiny external store over localStorage, read through useSyncExternalStore. ----
   Why not useEffect + setState? On the server there is no localStorage, so the first
   client render must match the server's empty cart. useSyncExternalStore does that
   by design: getServerSnapshot (empty) for hydration, then the real value. */

const EMPTY: readonly CartLine[] = [];
let snapshot: readonly CartLine[] | null = null; // null = not read from localStorage yet
const listeners = new Set<() => void>();

// localStorage is user-editable, so never trust its shape.
function parseStored(raw: string | null): CartLine[] {
  if (!raw) return [];
  try {
    const data: unknown = JSON.parse(raw);
    if (!Array.isArray(data)) return [];
    return data.flatMap((x) => {
      if (typeof x !== "object" || x === null) return [];
      const o = x as Record<string, unknown>;
      if (
        typeof o.dishId !== "string" ||
        typeof o.name !== "string" ||
        typeof o.priceEtb !== "number" ||
        typeof o.qty !== "number"
      ) {
        return [];
      }
      return [{ dishId: o.dishId, name: o.name, priceEtb: o.priceEtb, qty: clampQty(o.qty) }];
    });
  } catch {
    return [];
  }
}

function read(): readonly CartLine[] {
  if (snapshot === null) {
    let raw: string | null = null;
    try {
      raw = window.localStorage.getItem(STORAGE_KEY);
    } catch {
      /* private mode: keep the cart in memory only */
    }
    snapshot = parseStored(raw);
  }
  return snapshot;
}

function write(next: readonly CartLine[]) {
  snapshot = next;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    /* ignore: the in-memory snapshot still works for this tab */
  }
  listeners.forEach((l) => l());
}

function subscribe(onChange: () => void) {
  listeners.add(onChange);
  // Keep several open tabs in step.
  const onStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY || e.key === null) {
      snapshot = null; // re-read on the next getSnapshot
      onChange();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(onChange);
    window.removeEventListener("storage", onStorage);
  };
}

const noopSubscribe = () => () => {};

/* ---- Actions: plain functions, so their identity never changes. ---- */

function add(dish: Omit<CartLine, "qty">) {
  const cur = read();
  const has = cur.some((l) => l.dishId === dish.dishId);
  write(
    has
      ? cur.map((l) => (l.dishId === dish.dishId ? { ...l, qty: clampQty(l.qty + 1) } : l))
      : [...cur, { ...dish, qty: 1 }],
  );
}
function setQty(dishId: string, qty: number) {
  write(read().map((l) => (l.dishId === dishId ? { ...l, qty: clampQty(qty) } : l)));
}
function remove(dishId: string) {
  write(read().filter((l) => l.dishId !== dishId));
}
function clear() {
  write([]);
}

type CartContextValue = {
  lines: readonly CartLine[];
  ready: boolean; // false until the browser has read localStorage (avoids a hydration mismatch)
  count: number;
  totalEtb: number; // display only: the server re-prices every order
  add: typeof add;
  setQty: typeof setQty;
  remove: typeof remove;
  clear: typeof clear;
};

const CartContext = createContext<CartContextValue | null>(null);

export default function Providers({ children }: { children: ReactNode }) {
  const lines = useSyncExternalStore(subscribe, read, () => EMPTY);
  const ready = useSyncExternalStore(noopSubscribe, () => true, () => false);

  const value = useMemo<CartContextValue>(
    () => ({
      lines,
      ready,
      count: lines.reduce((n, l) => n + l.qty, 0),
      totalEtb: lines.reduce((s, l) => s + l.priceEtb * l.qty, 0),
      add,
      setQty,
      remove,
      clear,
    }),
    [lines, ready],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <Providers>");
  return ctx;
}
