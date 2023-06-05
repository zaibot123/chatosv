import React, { useState } from "react";

export default function Toggle(changeText) {
  // let [changeText, setChangeText] = useState(false);
  const handleChange = () => {
    console.log(changeText)
    return setChangeText(!changeText);
  };

  return (
    <div>
      <button onClick={() => handleChange()}>Toggle text representation: </button>
      {changeText ? "Plaintext" : "Encrypted"}
    </div>
  );
}