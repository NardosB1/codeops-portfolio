import React from "react";

const Card = ({ value }) => {
  const { image, name, price, spicy } = value;

  const imgs = new URL(
    `../../../../../Module-02/day-23/imgs/${image}`,
    import.meta.url,
  ).href;

  return (
    <div className="card">
      <img src={imgs} alt={name} />
      <p> {name} </p>
      <p> {price} </p>
      {spicy && <p> Spicy </p>}
    </div>
  );
};

export default Card;
