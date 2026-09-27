import { useParams, Link } from "react-router-dom";
import { useAsync } from "../../shared/hooks/useAsync";
import { fetchDish } from "./lib/mockApi";
import { useCart } from "../cart/context/CartContext";
import Button from "../../shared/components/Button";

export default function DishPage() {
  const { dishId } = useParams<{ dishId: string }>(); // dynamic route param
  const { addItem } = useCart();
  const state = useAsync(() => fetchDish(dishId!), [dishId]);

  if (state.status === "loading") return <p role="status">Loading dish…</p>;
  if (state.status === "error") return <p className="state-msg state-msg--error" role="alert">{state.error.message}</p>;
  if (!state.data) return <p className="state-msg state-msg--empty">Dish not found. <Link to="/menu">Back to menu</Link></p>;

  const dish = state.data;
  return (
    <section className="page">
      <h1>{dish.name}</h1>
      <p>{dish.description}</p>
      <p><strong>{dish.price} ETB</strong> · {dish.category}</p>
      <Button onClick={() => addItem({ dishId: dish.id, name: dish.name, price: dish.price })}>
        Add to cart
      </Button>
    </section>
  );
}
