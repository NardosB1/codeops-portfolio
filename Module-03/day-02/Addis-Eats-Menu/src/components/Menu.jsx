import React from "react";
import PropTypes from "prop-types";
import Dish from "./Dish";
import Card from "./Card";

function Menu({ menuItems = [], selectedCategory = "Mains" }) {
  // Filter menu items by selected category
  const filteredDishes = menuItems.filter(
    (item) => item.category === selectedCategory
  );

  return (
    <div>
      <h2>Menu Category: {selectedCategory}</h2>

      {/* Empty State Check */}
      {filteredDishes.length === 0 ? (
        <p>No dishes found in this category.</p>
      ) : (
        filteredDishes.map((dish) => (
          <Card key={dish.id}>
            <Dish
              name={dish.name}
              price={dish.price}
              spicy={dish.spicy}
            />
          </Card>
        ))
      )}
    </div>
  );
}

Menu.propTypes = {
  menuItems: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      name: PropTypes.string.isRequired,
      price: PropTypes.number.isRequired,
      category: PropTypes.string.isRequired,
      spicy: PropTypes.bool,
    })
  ),
  selectedCategory: PropTypes.string,
};

export default Menu;