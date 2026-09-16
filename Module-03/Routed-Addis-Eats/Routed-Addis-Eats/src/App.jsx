import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from "./Layout";
import Landing from "./pages/Landing";
import Menu from "./pages/Menu";
import DishDetail from "./pages/DishDetail";
import Checkout from "./pages/Checkout";
import SignIn from "./pages/SignIn";
import NotFound from "./pages/NotFound";
import RequireAuth from "./auth/RequireAuth";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";

export default function App() {
return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
            <Routes>
                <Route path="/" element={<Layout />}>
                <Route index element={<Landing />} />

                <Route path="menu" element={<Menu />} />
                <Route path="menu/:id" element={<DishDetail />} />

                <Route path="checkout" element={<RequireAuth> <Checkout /> </RequireAuth>} />

                <Route path="signin" element={<SignIn />} />

                <Route path="*" element={<NotFound />} />
            </Route>
            </Routes>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
);
}