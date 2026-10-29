import React from "react";
import Menu from "./Menu";
import { menuData } from "./data";

function App() {
  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
      <h1>Addis Eats</h1>
      <Menu menuItems={menuData} selectedCategory="Mains" />
    </div>
  );
}

export default App;