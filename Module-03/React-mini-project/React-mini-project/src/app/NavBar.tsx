import { NavLink } from "react-router-dom";
import { useCart } from "../features/cart/context/CartContext";

export default function NavBar() {
  const { count } = useCart();
  return (
    <nav className="navbar">
      <NavLink to="/" end className="brand">Addis Eats</NavLink>
      <div className="nav-links">
        <NavLink to="/menu">Menu</NavLink>
        <NavLink to="/cart">Cart{count > 0 ? ` (${count})` : ""}</NavLink>
      </div>
    </nav>
  );
}
