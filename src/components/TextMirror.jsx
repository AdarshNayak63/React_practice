import React, { useState } from "react";

function TextMirror() {
  const [text, setText] = useState("");

  const handleChange = (e) => {
    setText(e.target.value);
  };

  return (
    <div>
      <input
        type="text"
        value={text}
        onChange={handleChange}
        placeholder="Type something..."
      />

      <p>{text}</p>
    </div>
  );
}

export default TextMirror;