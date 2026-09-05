import { useCart } from '../cart/CartProvider';

export default function CheckoutPanel() {
  const { items, total, removeItem, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <aside className="checkout">
        <h2>Your order</h2>
        <p className="status">Your cart is empty — add a dish to get started.</p>
      </aside>
    );
  }

  return (
    <aside className="checkout">
      <h2>Your order</h2>
      <ul className="checkout-list">
        {items.map((item) => (
          <li key={item.id}>
            <span>
              {item.name} × {item.qty}
            </span>
            <span>{item.price * item.qty} ETB</span>
            <button
              className="remove-btn"
              onClick={() => removeItem(item.id)}
              aria-label={`Remove ${item.name} from cart`}
            >
              ✕
            </button>
          </li>
        ))}
      </ul>
      <p className="checkout-total">Total: {total} ETB</p>
      <button className="clear-btn" onClick={clearCart}>
        Clear cart
      </button>
    </aside>
  );
}
