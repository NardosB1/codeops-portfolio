import React from "react";



const Card = ({ value }) => {
    console.log(value);
    const { name, price } = value;
  return (
    <div className="card">
      <img src="" alt="no pic" srcset="" />
      <p> {name} </p>
      <p> {price} </p>
    </div>
  );
};

export default Card;
