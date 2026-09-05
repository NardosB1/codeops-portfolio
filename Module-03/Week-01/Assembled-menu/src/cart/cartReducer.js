export const initialCartState = { items: [] };

export const cartActions = {
    add: (item) => ({ type: 'cart/add', payload: { item } }),
    remove: (id) => ({ type: 'cart/remove', payload: { id } }),
    clear: () => ({ type: 'cart/clear' }),
};

export function cartReducer(state, action) {
switch (action.type) {
    case 'cart/add': {
    const { item } = action.payload;

    const alreadyInCart = state.items.some((i) => i.id === item.id);

    if (alreadyInCart) {
        return {...state, items: state.items.map((i) =>i.id === item.id ? { ...i, qty: i.qty + 1 } : i),};
    }

    return { ...state, items: [...state.items, { ...item, qty: 1 }], };
    }

    case 'cart/remove': {
    const { id } = action.payload;
    return { ...state, items: state.items.filter((i) => i.id !== id), };
    }

    case 'cart/clear': {return initialCartState;
    }

    default: {throw new Error(`cartReducer: unknown action type "${action.type}"`); }
} }
