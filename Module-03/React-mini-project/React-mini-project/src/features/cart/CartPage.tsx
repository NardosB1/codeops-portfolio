import { Link } from "react-router-dom";
import { useCart } from "./context/CartContext";
import Button from "../../shared/components/Button";

export default function CartPage() {
  const { items, total, updateQty, removeItem } = useCart(); // cart read here — screen #2

  if (items.length === 0) {
    return (
      <section className="page">
        <h1>Cart</h1>
        <p className="state-msg state-msg--empty">Your cart is empty.</p>
        <Link className="button" to="/menu">Browse the menu</Link>
      </section>
    );
  }

  return (
    <section className="page">
      <h1>Cart</h1>
      <ul className="dish-list">
        {items.map((item) => (
          <li key={item.dishId} className="cart-row">
            <span>{item.name}</span>
            <label>
              <span className="sr-only">Quantity for {item.name}</span>
              <input
                type="number"
                min={0}
                value={item.qty}
                onChange={(e) => updateQty(item.dishId, Number(e.target.value))}
                aria-label={`Quantity for ${item.name}`}
              />
            </label>
            <span>{item.qty * item.price} ETB</span>
            <Button variant="danger" onClick={() => removeItem(item.dishId)}>Remove</Button>
          </li>
        ))}
      </ul>
      <p><strong>Total: {total} ETB</strong></p>
      <Link className="button button--primary" to="/checkout">Checkout</Link>
    </section>
  );
}
