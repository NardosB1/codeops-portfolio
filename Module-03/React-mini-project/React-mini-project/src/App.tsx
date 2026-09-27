import { BrowserRouter } from "react-router-dom";
import { CartProvider } from "./features/cart/context/CartContext";
import AppRoutes from "./app/routes";

export default function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <AppRoutes />
      </CartProvider>
    </BrowserRouter>
  );
}
