"use client";

import { useEffect, useState } from "react";
import FeedbackForm from "./components/FeedbackForm";
import FeedbackList from "./components/FeedbackList";
import { getFeedbacks, Feedback } from "./actions/feedback";
import "./components/css/Style.css";

export default function App() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    async function loadData() {
      const data = await getFeedbacks();
      setFeedbacks(data);
    }
    loadData();
  }, []);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [isDarkMode]);

  const handleAddFeedback = (newFeedback: Feedback) => {
    setFeedbacks(prev => {
      const exists = prev.some(fb => fb.id === newFeedback.id);
      if (exists) {
        return prev.map(fb => fb.id === newFeedback.id ? newFeedback : fb);
      }
      return [newFeedback, ...prev];
    });
  };

  return (
    <div className="container">
      <button 
        className={`base ${isDarkMode ? 'darkMode' : 'lightMode'}`}
        onClick={toggleTheme}
      >
        {isDarkMode ? '🌙' : '🌞'}
      </button>

      <h1>Feedback System</h1>

      <FeedbackForm setFeedbackList={handleAddFeedback} />

      <FeedbackList feedbacks={feedbacks} />
    </div>
  );
}