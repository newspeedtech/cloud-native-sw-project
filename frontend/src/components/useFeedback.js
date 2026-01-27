// Component to generate messages and errors

import { useState } from "react";

export function useFeedback() {
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

  return { feedback, showSuccess, showError, clearFeedback };
}
