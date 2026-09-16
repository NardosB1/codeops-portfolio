import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchSpecials } from "../api/menu";
import DishCard from "../components/DishCard";

export default function Landing() {
    const [specials, setSpecials] = useState([]);
    const [status, setStatus] = useState("loading");

useEffect(() => {
    let ignore = false;
    fetchSpecials().then((data) => {
        if (!ignore) {
            setSpecials(data);
            setStatus("ready");
        }
    })
        .catch(() => {
        if (!ignore) setStatus("error");
    });
    return () => {ignore = true;
    };
}, []);

return (
    <section className="landing">
        <div className="hero-banner">
        <div className="hero-eyebrow">
            <span className="dot" />
            Special Selection
        </div>
        <p className="hero-amharic">እንኳን ደህና መጡ</p>
        <h1 className="hero-title"> Communal Warmth, <br />
        Slow-Cooked Heritage
        </h1>
        <p className="hero-copy">
            Ethiopian and East African favorites, gathered around the mesob and delivered to your door.
        </p>
        <Link to="/menu" className="hero-cta">
            View the full menu
        </Link>
        </div>

    <div className="specials-header">
        <h2>Today&rsquo;s Specials</h2>
        {status === "ready" && <span className="count">{specials.length} live</span>}
    </div>

    {status === "loading" && <p>Loading specials&hellip;</p>}
    {status === "error" && <p>Couldn&rsquo;t load specials right now.</p>}
    {status === "ready" && (
        <div className="dish-list">
        {specials.map((dish) => (
            <DishCard key={dish.id} dish={dish} />
        ))}
        </div>
    )}
    </section>
);
}