import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { fetchDishById } from "../api/menu";
import { useCart } from "../context/CartContext";
import { parseSpiceLevel, placeholderColor } from "../lib/dishDisplay";

export default function DishDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();

    const [dish, setDish] = useState(null);
    const [status, setStatus] = useState("loading");
    const [quantity, setQuantity] = useState(1);

useEffect(() => {
    let ignore = false;
    setStatus("loading");
    setQuantity(1);
    fetchDishById(id)
        .then((data) => {
        if (!ignore) {setDish(data);
            setStatus("ready");
        }
    })
        .catch(() => {
        if (!ignore) setStatus("error");
    });
    return () => {ignore = true;};}, [id]);

if (status === "loading") return <p>Loading dish&hellip;</p>;

if (status === "error") {
    return (
      <div>
        <p>We couldn&rsquo;t find that dish.</p>
        <Link to="/menu">Back to menu</Link>
      </div>
    );
}

const { level, label } = parseSpiceLevel(dish.spiceLevel);

  return (
    <article className="dish-detail">
      <div
        className="dish-detail-hero"
        style={{ background: placeholderColor(dish.id) }}>
        <span className="monogram">{dish.nameEn.charAt(0)}</span>
        <div className="hero-actions">
            <button type="button" className="back-link" onClick={() => navigate(-1)} aria-label="Go back">
            &larr;
            </button>
        </div>
        <div className="hero-badges">
          {dish.isSpecial && <span className="badge badge-special">Chef&rsquo;s Special</span>}
          {dish.isFasting && <span className="badge badge-fasting">Fasting-Friendly</span>}
        </div>
      </div>

      <div className="dish-detail-heading">
        <div>
          <h1>{dish.nameEn}</h1>
          <p className="dish-name-am">{dish.nameAm}</p>
        </div>
        <div className="dish-detail-price">
          <div className="dish-price-row">
            <span className="dish-price-currency">ETB</span>
            <span className="dish-price">{dish.priceETB}</span>
          </div>
        </div>
      </div>

      {dish.tagline && <p className="dish-tagline">{dish.tagline}</p>}

      <div className="dish-meta-row">
        <span className="meta-chip">{dish.category}</span>
        {level !== null ? (
          <span className="meta-chip">
            {"🌶️".repeat(level)} {label}
          </span>
        ) : (
          <span className="meta-chip">{label}</span>
        )}
        <span className="meta-chip">{dish.servings}</span>
      </div>

      <p className="dish-full-description">{dish.description}</p>

      {dish.ingredients?.length > 0 && (
        <>
          <h2 className="ingredient-heading">Ingredients</h2>
          <ul className="ingredient-tags">
            {dish.ingredients.map((ingredient) => (
              <li key={ingredient}>{ingredient}</li>
            ))}
          </ul>
        </>
      )}

      <div className="detail-order-bar">
        <div className="qty-stepper">
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            aria-label="Decrease quantity"
          >
            &minus;
          </button>
          <span className="qty-value">{quantity}</span>
          <button
            type="button"
            onClick={() => setQuantity((q) => q + 1)}
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>
        <button
          type="button"
          className="add-to-basket"
          onClick={() => addToCart(dish, quantity)}
        >
          <span>Add to Basket</span>
          <span className="add-price">ETB {dish.priceETB * quantity}</span>
        </button>
      </div>
    </article>
  );
}