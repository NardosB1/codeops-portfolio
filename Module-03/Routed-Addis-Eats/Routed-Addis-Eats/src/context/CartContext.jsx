import { createContext, useContext, useMemo, useState } from "react";

const CartContext = createContext(null);

export function CartProvider({ children }) {
const [items, setItems] = useState([]);

function addToCart(dish, qty = 1) {
    setItems((current) => {
    const existing = current.find((item) => item.id === dish.id);
    if (existing) {
        return current.map((item) => item.id === dish.id ? { ...item, qty: item.qty + qty } : item);
    }
    return [...current, { id: dish.id, nameEn: dish.nameEn, priceETB: dish.priceETB, qty },];
    });
}

function removeFromCart(id) {
    setItems((current) => current.filter((item) => item.id !== id));
}

const totalItems = useMemo(() => items.reduce((sum, item) => sum + item.qty, 0), [items]);

const totalPriceETB = useMemo(() => items.reduce((sum, item) => sum + item.priceETB * item.qty, 0), [items]);

const value = { items, addToCart, removeFromCart, totalItems, totalPriceETB };

return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error("useCart must be called inside a <CartProvider>");
}
    return context;
}