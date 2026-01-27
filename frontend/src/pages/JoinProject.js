import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFeedback } from "./../components/useFeedback";

export default function JoinProject({setAuthenticated}) {
  const [slug, setSlug] = useState("");
  const { feedback, showSuccess, showError } = useFeedback();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("access_token");
    try {
      const res = await fetch(`http://localhost:5000/projects/${slug}/join`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (res.ok) {
        showSuccess(`Successfully joined project: ${data.name}`);
        setSlug("");
        // Redirect to projects page after a short delay
        setTimeout(() => navigate("/projects"), 1500);
      } else if (res.status === 401) {
        setAuthenticated(false);
        showError("Session expired. Please log in again.");
      } else {
        showError(data.error || "Failed to join project");
      }
    } catch (err) {
      console.error(err);
      showError("Network error - couldn't join project");
    }
  };

  return (
    <div>
      <div style={{ textAlign: "center" }}>
        <h1>Join a Project</h1>
        <p>Enter a project slug to join</p>

        <form onSubmit={handleSubmit} style={{ marginTop: "2rem" }}>
          <div>
            <input
              type="text"
              className="text-field"
              placeholder="Project Slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              required
            />
          </div>
          <button className="button" type="submit">
            {"Join Project"}
          </button>
        </form>
        {feedback.message && (
            <p style={{width: "350px", marginTop: "30px"}}
              className={feedback.type === "error" ? "error-message-box" : "success-message-box"}>
              {feedback.message}
            </p>
        )}
      </div>
    </div>
  );
}
