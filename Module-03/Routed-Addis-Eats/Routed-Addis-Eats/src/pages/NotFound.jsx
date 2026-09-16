import { Link } from "react-router-dom";

export default function NotFound() {
return (
    <section className="not-found">
    <h1>404</h1>
    <p>We couldn&rsquo;t find that page.</p>
    <Link to="/">Back to home</Link>
    </section>
);
}