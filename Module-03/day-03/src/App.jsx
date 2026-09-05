import { useState, react } from 'react';

const App = () => {
  const [count, setCount] = useState(0);

  function add() {
    setCount(count + 1);
  }


  function sub() {
    setCount(count - 1);
  }

  return (
    <div>
      <h1> {count} </h1>
      <button onClick={add}> add </button>
      <button onClick={sub}> sub </button>
    </div>
  );
};

export default App