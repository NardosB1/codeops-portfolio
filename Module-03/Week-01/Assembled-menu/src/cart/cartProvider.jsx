import { createContext, useContext, useReducer, useMemo, useCallback } from 'react';
import { cartReducer, cartActions, initialCartState } from './cartReducer';

const CartContext = createContext(null);

export function CartProvider({ children }) {
    const [state, dispatch] = useReducer(cartReducer, initialCartState);
    
const addItem = useCallback((item) => dispatch(cartActions.add(item)), []);
const removeItem = useCallback((id) => dispatch(cartActions.remove(id)), []);
const clearCart = useCallback(() => dispatch(cartActions.clear()), []);

const total = useMemo(() => state.items.reduce((sum, item) => sum + item.price * item.qty, 0),[state.items]);

const value = useMemo(() => ({ items: state.items, total, addItem,removeItem, clearCart }), [state.items, total, addItem, removeItem, clearCart]);

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === null) {throw new Error('useCart must be used inside a <CartProvider>');}
    return context;
}
