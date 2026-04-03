"use server";

export type Feedback = {
  id: number;
  name: string;
  message: string;
  rating: number;
};

let feedbacks: Feedback[] = [];

export async function addFeedback(formData: FormData) {
  const name = formData.get("name") as string;
  const message = formData.get("message") as string;
  const rating = Number(formData.get("rating"));

  const newFeedback: Feedback = {
    id: Date.now(),
    name,
    message,
    rating,
  };

  feedbacks.unshift(newFeedback);

  return newFeedback;
}

export async function getFeedbacks() {
  return feedbacks;
}