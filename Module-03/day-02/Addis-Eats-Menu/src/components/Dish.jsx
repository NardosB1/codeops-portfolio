import React from "react";
import PropTypes from "prop-types";

function Dish({ name, price, spicy, currency = "$" }) {
  return (
    <div>
      <h3>
        {name} {Boolean(spicy) && <span style={{ color: "red", fontSize: "0.8em" }}>🌶️ Spicy</span>}
      </h3>
      <p>
        Price: {currency}{price.toFixed(2)}
      </p>
    </div>
  );
}

Dish.propTypes = {
  name: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired,
  spicy: PropTypes.bool,
  currency: PropTypes.string,
};

export default Dish;