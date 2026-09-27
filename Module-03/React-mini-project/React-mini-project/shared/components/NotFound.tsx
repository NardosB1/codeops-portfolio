import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <section className="page">
      <h1>Page not found</h1>
      <p>That route doesn't exist.</p>
      <Link className="button" to="/">Back home</Link>
    </section>
  );
}
