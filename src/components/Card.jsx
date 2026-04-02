import styles from "./css/Card.module.css";

function Card() {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Card Title</h2>
      <p>This is a simple card using CSS Modules.</p>
    </div>
  );
}

export default Card;