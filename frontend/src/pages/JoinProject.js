import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function JoinProject({ setAuthenticated }) {
  const [slug, setSlug] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    const token = localStorage.getItem("access_token");
    if (!token) {
      setError("You must be signed in.");
      setLoading(false);
      return;
    }

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
        setMessage(`Successfully joined project: ${data.name}`);
        setSlug("");
        // Redirect to projects page after a short delay
        setTimeout(() => navigate("/projects"), 1500);
      } else if (res.status === 401) {
        setAuthenticated(false);
        setError("Session expired. Please log in again.");
      } else {
        setError(data.error || "Failed to join project");
      }
    } catch (err) {
      console.error(err);
      setError("Network error - couldn't join project");
    } finally {
      setLoading(false);
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
              disabled={loading}
            />
          </div>

          <button className="button" type="submit" disabled={loading}>
            {loading ? "Joining..." : "Join Project"}
          </button>
        </form>

        {message && <p style={{ color: "green", marginTop: "1rem" }}>{message}</p>}
        {error && <p style={{ color: "red", marginTop: "1rem" }}>{error}</p>}
      </div>
    </div>
  );
}
