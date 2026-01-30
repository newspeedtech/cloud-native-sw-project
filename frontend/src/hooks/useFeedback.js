import { useState } from "react";

export default function useFeedback({ customStyles = {} }) {
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

  return {
    FeedbackDisplay: () => (
      <>
        {feedback.message && (
          <p
            style={customStyles}
            className={feedback.type === "error" ? "error-message-box" : "success-message-box"}>
            {feedback.message}
          </p>
        )}
      </>
    ),
    showSuccess,
    showError,
    clearFeedback
  };
}