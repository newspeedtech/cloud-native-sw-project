import { useState } from "react";
import NavBar from "../components/NavBar";

export default function Signup() {
  const [username, setUsername] = useState("");
  const [userid, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);

    try {
      const res = await fetch("http://localhost:5000/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Signup failed");
      }

      setMessage("Signup successful!");
      setUsername("");
      setPassword("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
    <NavBar/>
      <div class="login-form">
      <h1 style={{ color: "white" }}>Sign Up</h1>

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
            type="text" name="userid" class="text-field"
            placeholder="UserId"
            value={userid}
            onChange={(e) => setUserId(e.target.value)}
            required
          />
        </div>

        <div>
          <input
            type="password" name="username" class="text-field"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button class="button" type="submit" disabled={loading}>
          {loading ? "Creating account..." : "Sign Up"}
        </button>
      </form>
      <form class="links">
        <a href="/login">Already have an account?</a>
      </form>
      {message && <p style={{ color: "green" }}>{message}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  </div>
  );
}