import React, { useState } from 'react';

function Rough() {
  const [ob, setOb] = useState({
    name: "Rajib",
    address: {
      city: "ABC",
      dist: "Dist-1"
    }
  });
  const [name, setName] = useState('Priya');

  const handleButton = () => {
    setName('Priyanka');
    // Update nested state properly
    setOb(prev => ({
      ...prev,
      address: {
        ...prev.address,
        city: "ABC - 2"
      }
    }));
  };

  return (
    <div>
      <h1>Hello</h1>
      <p>name: {name}</p>
      <p>ob name: {ob.name}</p>
      <p>ob city: {ob.address.city}</p>

      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder='Enter name'
      />

      <input
        value={ob.address.city}
        onChange={(e) =>
          setOb(prev => ({
            ...prev,
            address: {
              ...prev.address,
              city: e.target.value
            }
          }))
        }
        placeholder='Enter ob city'
      />

      <button onClick={handleButton}>Change</button>
    </div>
  );
}

export default Rough;
