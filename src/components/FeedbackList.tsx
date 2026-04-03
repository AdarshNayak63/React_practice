import { Feedback } from "../actions/feedback";

export default function FeedbackList({
  feedbacks,
}: {
  feedbacks: Feedback[];
}) {
  const renderStars = (rating: number) => {
    return "⭐".repeat(rating);
  };

  return (
    <div className="list">
      <h2>All Feedback ({feedbacks.length})</h2>

      {feedbacks.length === 0 && (
        <div className="empty">
          <p>No feedback yet. Be the first to share your thoughts! 🌟</p>
        </div>
      )}

      {feedbacks.map((fb) => (
        <div key={fb.id} className="card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "15px" }}>
            <h3>{fb.name}</h3>
            <span className="rating">{renderStars(fb.rating)}</span>
          </div>
          <p>{fb.message}</p>
        </div>
      ))}
    </div>
  );
}