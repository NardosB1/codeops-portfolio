import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { parseSpiceLevel, placeholderColor } from "../lib/dishDisplay";

export default function DishCard({ dish }) {
    const { addToCart } = useCart();
    const { level, label } = parseSpiceLevel(dish.spiceLevel);

function handleQuickAdd(event) {
    event.preventDefault();
    event.stopPropagation();
    addToCart(dish);
}

return (
    <Link to={`/menu/${dish.id}`} className="dish-card">
        <div className="dish-thumb"
            style={{ background: placeholderColor(dish.id) }}>
        <span className="monogram">{dish.nameEn.charAt(0)}</span>
        {dish.isSpecial && <span className="thumb-badge special">Special</span>}
        {!dish.isSpecial && dish.isFasting && (
        <span className="thumb-badge fasting">Fasting</span>
        )}
    </div>

    <div className="dish-card-body">
        <div className="dish-card-heading">
            <h3>{dish.nameEn}</h3>
            <p className="dish-name-am">{dish.nameAm}</p>
            <p className="dish-description">{dish.description}</p>
        </div>

        <div className="dish-card-footer">
            <div>
            {level !== null ? (
                <div className="spice-meter">
                {[1, 2, 3].map((n) => (
                    <span key={n} className={`spice-dot${n <= level ? " filled" : ""}`} />
                ))}
                <span className="spice-label">{label}</span>
            </div>
            ) : (
                <span className="spice-label">{label}</span>
            )}
            <div className="dish-price-row">
                <span className="dish-price-currency">ETB</span>
                <span className="dish-price">{dish.priceETB}</span>
            </div>
        </div>
        <button type="button" className="quick-add" onClick={handleQuickAdd} aria-label={`Add ${dish.nameEn} to cart`}> + </button>
        </div>
        </div>
    </Link>
);
}