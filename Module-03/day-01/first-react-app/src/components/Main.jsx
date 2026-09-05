import React from "react";
import "../Style/global.css";
import Card from "./Card";

const Dish = [
  {
    id: 1,
    name: "Doro Wat",
    category: "Main",
    price: 440,
    spicy: true,
    image:
      "C:/Users/aenda/OneDrive/Desktop/IBT/Module-02/day-23/imgs/doroWat.jpg",
  },
  {
    id: 2,
    name: "Shiro",
    category: "Vegetarian",
    price: 250,
    spicy: false,
    image:
      "C:/Users/aenda/OneDrive/Desktop/IBT/Module-02/day-23/imgs/Shiro.jpg",
  },
  {
    id: 3,
    name: "Tibs",
    category: "Main",
    price: 340,
    spicy: true,
    image: "C:/Users/aenda/OneDrive/Desktop/IBT/Module-02/day-23/imgs/Tibs.jpg",
  },
  {
    id: 4,
    name: "Misir Wat",
    category: "Vegetarian",
    price: 240,
    spicy: false,
    image:
      "C:/Users/aenda/OneDrive/Desktop/IBT/Module-02/day-23/imgs/Misir.jpg",
  },
  {
    id: 5,
    name: "Kitfo",
    category: "Main",
    price: 400,
    spicy: true,
    image:
      "C:/Users/aenda/OneDrive/Desktop/IBT/Module-02/day-23/imgs/kitfo.jpg",
  },
];

const Main = () => {
  return (
    <div className="main">
          {Dish.map((Dish) => {

        return <Card key={Dish.id} value={Dish} />;
      })}
    </div>
  );
};

export default Main;
