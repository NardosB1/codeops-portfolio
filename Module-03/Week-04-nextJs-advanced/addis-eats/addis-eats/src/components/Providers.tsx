"use client"; // cart context needs state and localStorage

import {
  createContext, useCallback, useContext, useEffect, useMemo, useReducer, type ReactNode,
} from "react";

export type CartLine = { dishId: string; name: string; priceEtb: number; qty: number };

type State = { lines: CartLine[]; ready: boolean };
type Action =
  | { type: "hydrate"; lines: CartLine[] }
  | { type: "add"; dish: Omit<CartLine, "qty"> }
  | { type: "setQty"; dishId: string; qty: number }
  | { type: "remove"; dishId: string }
  | { type: "clear" };

const STORAGE_KEY = "addis-eats-cart-v1";
const MAX_QTY = 20;
const clampQty = (n: number) => Math.max(1, Math.min(Math.trunc(n), MAX_QTY));

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "hydrate":
      return { lines: action.lines, ready: true };
    case "add": {
      const has = state.lines.some((l) => l.dishId === action.dish.dishId);
      return {
        ...state,
        lines: has
          ? state.lines.map((l) => (l.dishId === action.dish.dishId ? { ...l, qty: clampQty(l.qty + 1) } : l))
          : [...state.lines, { ...action.dish, qty: 1 }],
      };
    }
    case "setQty":
      return { ...state, lines: state.lines.map((l) => (l.dishId === action.dishId ? { ...l, qty: clampQty(action.qty) } : l)) };
    case "remove":
      return { ...state, lines: state.lines.filter((l) => l.dishId !== action.dishId) };
    case "clear":
      return { ...state, lines: [] };
  }
}

// localStorage is user-editable, so never trust its shape.
function parseStored(raw: string | null): CartLine[] {
  if (!raw) return [];
  try {
    const data: unknown = JSON.parse(raw);
    if (!Array.isArray(data)) return [];
    return data.flatMap((x) => {
      if (typeof x !== "object" || x === null) return [];
      const o = x as Record<string, unknown>;
      if (typeof o.dishId !== "string" || typeof o.name !== "string" ||
          typeof o.priceEtb !== "number" || typeof o.qty !== "number") return [];
      return [{ dishId: o.dishId, name: o.name, priceEtb: o.priceEtb, qty: clampQty(o.qty) }];
    });
  } catch {
    return [];
  }
}

type CartContextValue = {
  lines: CartLine[];
  ready: boolean; // false until localStorage has been read (avoids hydration mismatch)
  count: number;
  totalEtb: number; // display only: the server re-prices at checkout
  add: (dish: Omit<CartLine, "qty">) => void;
  setQty: (dishId: string, qty: number) => void;
  remove: (dishId: string) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export default function Providers({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { lines: [], ready: false });

  // Load once after mount. Not during render, so server and client HTML match.
  useEffect(() => {
    let raw: string | null = null;
    try { raw = window.localStorage.getItem(STORAGE_KEY); } catch { /* private mode */ }
    dispatch({ type: "hydrate", lines: parseStored(raw) });
  }, []);

  useEffect(() => {
    if (!state.ready) return;
    try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state.lines)); } catch { /* ignore */ }
  }, [state.lines, state.ready]);

  const add = useCallback((dish: Omit<CartLine, "qty">) => dispatch({ type: "add", dish }), []);
  const setQty = useCallback((dishId: string, qty: number) => dispatch({ type: "setQty", dishId, qty }), []);
  const remove = useCallback((dishId: string) => dispatch({ type: "remove", dishId }), []);
  const clear = useCallback(() => dispatch({ type: "clear" }), []);

  const value = useMemo<CartContextValue>(
    () => ({
      lines: state.lines,
      ready: state.ready,
      count: state.lines.reduce((n, l) => n + l.qty, 0),
      totalEtb: state.lines.reduce((s, l) => s + l.priceEtb * l.qty, 0),
      add, setQty, remove, clear,
    }),
    [state, add, setQty, remove, clear],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <Providers>");
  return ctx;
}