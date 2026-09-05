import { useCart } from '../cart/CartProvider';

export default function Header() {
  const { items } = useCart();
  const itemCount = items.reduce((sum, item) => sum + item.qty, 0);

  return (
    <header className="app-header">
      <h1>Addis Eats</h1>
      <span className="cart-badge" aria-label={`${itemCount} items in cart`}>
         {itemCount}
      </span>
    </header>
  );
}
