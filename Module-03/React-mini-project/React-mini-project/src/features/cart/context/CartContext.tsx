import { createContext, useContext, useMemo, useReducer, type ReactNode } from "react";

export interface CartItem {
  dishId: string;
  name: string;
  price: number;
  qty: number;
}

interface CartState { items: CartItem[]; }

type CartAction =
  | { type: "ADD"; item: Omit<CartItem, "qty">; qty?: number }
  | { type: "REMOVE"; dishId: string }
  | { type: "UPDATE_QTY"; dishId: string; qty: number }
  | { type: "CLEAR" };

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD": {
      const existing = state.items.find((i) => i.dishId === action.item.dishId);
      if (existing) {
        return { items: state.items.map((i) =>
          i.dishId === action.item.dishId ? { ...i, qty: i.qty + (action.qty ?? 1) } : i) };
      }
      return { items: [...state.items, { ...action.item, qty: action.qty ?? 1 }] };
    }
    case "REMOVE":
      return { items: state.items.filter((i) => i.dishId !== action.dishId) };
    case "UPDATE_QTY":
      return { items: state.items.map((i) => (i.dishId === action.dishId ? { ...i, qty: action.qty } : i)).filter((i) => i.qty > 0) };
    case "CLEAR":
      return { items: [] };
    default:
      return state;
  }
}

interface CartContextValue {
  items: CartItem[];
  count: number;
  total: number;
  addItem: (item: Omit<CartItem, "qty">, qty?: number) => void;
  removeItem: (dishId: string) => void;
  updateQty: (dishId: string, qty: number) => void;
  clear: () => void;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [] });
  const value = useMemo<CartContextValue>(() => {
    const count = state.items.reduce((sum, i) => sum + i.qty, 0);
    const total = state.items.reduce((sum, i) => sum + i.qty * i.price, 0);
    return {
      items: state.items,
      count,
      total,
      addItem: (item, qty) => dispatch({ type: "ADD", item, qty }),
      removeItem: (dishId) => dispatch({ type: "REMOVE", dishId }),
      updateQty: (dishId, qty) => dispatch({ type: "UPDATE_QTY", dishId, qty }),
      clear: () => dispatch({ type: "CLEAR" }),
    };
  }, [state]);
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}
