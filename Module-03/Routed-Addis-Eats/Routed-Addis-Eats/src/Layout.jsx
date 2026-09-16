import { NavLink, Outlet } from "react-router-dom";
import { useCart } from "./context/CartContext";

export default function Layout() {
const { totalItems } = useCart();

return (
    <div className="app-shell">
    <header className="site-header">
        <NavLink to="/" end className="brand-block">
        <span className="brand-name">Addis Eats</span>
        <span className="brand-subtitle">Ethiopian Kitchen</span>
        </NavLink>
        <nav className="site-nav">
        <NavLink to="/" end> Home </NavLink>
        <NavLink to="/menu">Menu</NavLink>
        <NavLink to="/checkout" className="cart-pill">
            Checkout
            {totalItems > 0 && <span className="cart-count">{totalItems}</span>}
        </NavLink>
        </nav>
    </header>

    <main className="site-main">
        <Outlet />
    </main>

    <footer className="site-footer">
        <p>&copy; 2026 Addis Eats &mdash; CodeOps Full Stack, IBT College Canada</p>
    </footer>
    </div>
);
}