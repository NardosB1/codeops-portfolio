import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../cart/context/CartContext";
import { useCheckoutForm } from "./hooks/useCheckoutForm";
import Button from "../../shared/components/Button";

export default function CheckoutPage() {
  const { items, total, clear } = useCart();
  const { fields, setField, markTouched, shouldShowError, isValid, setSubmitted } = useCheckoutForm();
  const [placed, setPlaced] = useState(false);
  const navigate = useNavigate();

  if (placed) {
    return (
      <section className="page">
        <h1>Order placed</h1>
        <p>Thanks, {fields.name} — your order is on its way to {fields.address}.</p>
        <Button onClick={() => navigate("/")}>Back home</Button>
      </section>
    );
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
    if (!isValid) return;
    clear();
    setPlaced(true);
  }

  return (
    <section className="page">
      <h1>Checkout</h1>
      <p>{items.length} item(s) · {total} ETB</p>

      <form onSubmit={handleSubmit} noValidate>
        <div className="field">
          <label htmlFor="name">Name</label>
          <input
            id="name"
            value={fields.name}
            onChange={(e) => setField("name", e.target.value)}
            onBlur={() => markTouched("name")}
            aria-invalid={shouldShowError("name")}
          />
          {shouldShowError("name") && <span className="field-error">Name is required.</span>}
        </div>

        <div className="field">
          <label htmlFor="phone">Phone</label>
          <input
            id="phone"
            value={fields.phone}
            onChange={(e) => setField("phone", e.target.value)}
            onBlur={() => markTouched("phone")}
            aria-invalid={shouldShowError("phone")}
          />
          {shouldShowError("phone") && <span className="field-error">Enter a valid phone number.</span>}
        </div>

        <div className="field">
          <label htmlFor="address">Delivery address</label>
          <textarea
            id="address"
            value={fields.address}
            onChange={(e) => setField("address", e.target.value)}
            onBlur={() => markTouched("address")}
            aria-invalid={shouldShowError("address")}
          />
          {shouldShowError("address") && <span className="field-error">Address looks too short.</span>}
        </div>

        <Button type="submit">Place order</Button>
      </form>
    </section>
  );
}
