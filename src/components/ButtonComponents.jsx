function Button({ label, color }) {
  return (
    <button style={{ backgroundColor: color, color: "white", padding: "10px", border: "none" }}>
      {label}
    </button>
  );
}

export default Button;