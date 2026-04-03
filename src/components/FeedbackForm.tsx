"use client";

import { useTransition } from "react";
import { addFeedback, Feedback } from "../actions/feedback";

export default function FeedbackForm({
  setFeedbackList,
}: {
  setFeedbackList: (newFeedback: Feedback) => void;
}) {
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (formData: FormData) => {
    const tempId = Date.now();
    const tempFeedback: Feedback = {
      id: tempId,
      name: formData.get("name") as string,
      message: formData.get("message") as string,
      rating: Number(formData.get("rating")),
    };

    // Optimistic update - add to UI immediately
    setFeedbackList(tempFeedback);

    startTransition(async () => {
      const result = await addFeedback(formData);
      // Replace the optimistic feedback with the real one
      setFeedbackList(result);
    });
  };

  return (
    <form action={handleSubmit} className="form">
      <div className="form-group">
        <label htmlFor="name">Your Name</label>
        <input name="name" placeholder="Enter your name" required />
      </div>

      <div className="form-group">
        <label htmlFor="message">Your Feedback</label>
        <textarea name="message" placeholder="Share your thoughts..." required />
      </div>

      <div className="form-group">
        <label htmlFor="rating">Rating</label>
        <select name="rating" required>
          <option value="">Select rating</option>
          <option value="1">⭐ 1 - Poor</option>
          <option value="2">⭐⭐ 2 - Fair</option>
          <option value="3">⭐⭐⭐ 3 - Good</option>
          <option value="4">⭐⭐⭐⭐ 4 - Very Good</option>
          <option value="5">⭐⭐⭐⭐⭐ 5 - Excellent</option>
        </select>
      </div>

      <button type="submit" disabled={isPending}>
        {isPending ? "Submitting..." : "Submit Feedback"}
      </button>
    </form>
  );
}