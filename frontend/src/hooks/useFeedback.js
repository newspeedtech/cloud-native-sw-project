import { useState } from "react";
import { Alert } from "react-bootstrap";

export default function useFeedback({ glass = false } = {}) {
  const [feedback, setFeedback] = useState({ message: "", type: "" });

  const showSuccess = (message) => {
    setFeedback({ message, type: "success" });
  };

  const showError = (message) => {
    setFeedback({ message, type: "error" });
  };

  const clearFeedback = () => {
    setFeedback({ message: "", type: "" });
  };

  const FeedbackDisplay = () => (
    <>
      {feedback.message && (
        <Alert 
          variant={feedback.type === "error" ? "danger" : "success"}
          onClose={clearFeedback}
          dismissible
          className={`mt-3 ${glass ? 'glass-alert' : ''}`}
        >
          {feedback.message}
        </Alert>
      )}
    </>
  );

  return {
    FeedbackDisplay,
    showSuccess,
    showError,
    clearFeedback
  };
}
