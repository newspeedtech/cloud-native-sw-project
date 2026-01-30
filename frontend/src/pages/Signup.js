import { useEffect, useState } from "react";
import useFeedback from "../hooks/useFeedback";

export default function Signup() {
  const { FeedbackDisplay, showSuccess, showError } = useFeedback({marginBottom: "15px"});
  const [username, setUsername] = useState("");
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const returnPath = localStorage.getItem("returnPath");
    if (!returnPath) {
      localStorage.removeItem("intendedPage");
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, user_id: userId, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || showError("Signup failed"));
      }

      showSuccess("Signup successful! Please log in.");
      setUsername("");
      setUserId("");
      setPassword("");
    } catch (err) {
      showError(err.message);
    }
  };

  return (
    <div>
      <div class="login-form">
      <h1 style={{ color: "white" }}>Sign Up</h1>
      <FeedbackDisplay />
      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="text" name="username" class="text-field"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div>
          <input
            type="text" name="user_id" class="text-field"
            placeholder="User ID"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            required
          />
        </div>

        <div>
          <input
            type="password" name="password" class="text-field"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button class="button" type="submit">
          {"Sign Up"}
        </button>
      </form>
      <form class="links">
        <a href="/login">Already have an account?</a>
      </form>
    </div>
  </div>
  );
}