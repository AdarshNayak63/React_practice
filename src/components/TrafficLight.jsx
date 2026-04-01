function TrafficLight({ color }) {
  let message;

  switch (color) {
    case "red":
      message = "Stop";
      break;
    case "yellow":
      message = "Slow Down";
      break;
    case "green":
      message = "Go";
      break;
    default:
      message = "Invalid Color";
  }

  return (
    <div style={{ textAlign: "center", margin: "20px" }}>
      <div
        style={{
          width: "100px",
          height: "100px",
          borderRadius: "50%",
          backgroundColor: color,
          margin: "auto",
        }}
      ></div>

      <h3>{color.toUpperCase()}</h3>
      <p>{message}</p>
    </div>
  );
}

export default TrafficLight;