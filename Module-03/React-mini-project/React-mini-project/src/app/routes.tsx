import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "./Layout";
import Home from "../features/home/HomePage";
import Menu from "../features/menu/MenuPage";
import Dish from "../features/menu/DishPage";
import Cart from "../features/cart/CartPage";
import NotFound from "../shared/components/NotFound";
import RequireNonEmptyCart from "../features/checkout/RequireNonEmptyCart";
import ErrorBoundary from "../shared/components/ErrorBoundary";

// Checkout is the lazy-loaded route: it's not needed until the user
// commits to buying, so it ships in its own chunk.
const Checkout = lazy(() => import("../features/checkout/CheckoutPage"));

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="menu" element={<ErrorBoundary><Menu /></ErrorBoundary>} />
        <Route path="menu/:dishId" element={<Dish />} />
        <Route path="cart" element={<Cart />} />
        <Route
          path="checkout"
          element={
            <RequireNonEmptyCart>
              <Suspense fallback={<p className="page-fallback" role="status">Loading checkout…</p>}>
                <Checkout />
              </Suspense>
            </RequireNonEmptyCart>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
