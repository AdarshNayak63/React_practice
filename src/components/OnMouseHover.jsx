import React, { useState } from "react";

function HoverBox() {
  const [color, setColor] = useState("blue");

  const handleMouseEnter = () => {
    setColor("red");
  };

  const handleMouseLeave = () => {
    setColor("blue");
  };

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        width: "1130px",
        height: "200px",
        backgroundColor: color,
      }}
    >
    </div>
  );
}

export default HoverBox;