import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <section className="page">
      <h1>Addis Eats</h1>
      <p>Order Ethiopian dishes for delivery across Addis Ababa.</p>
      <Link className="button" to="/menu">Browse the menu</Link>
    </section>
  );
}
