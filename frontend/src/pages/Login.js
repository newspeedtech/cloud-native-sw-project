import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [username, setUsername] = useState("");
  const [userid, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok) {
        // Save JWT to localStorage
        localStorage.setItem("token", data.access_token);
        setMessage("Login successful!");
        // Optionally redirect to Create Project or home
        navigate("/home");
      } else {
        setMessage(data.error || "Login failed");
      }
    } catch (err) {
      console.error(err);
      setMessage("Network error");
    }
  };

  return (
      <div class="login-form">
      <h1 style={{ color: "white" }}>Login</h1>

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
        <button class="button" type="submit" onClick={() => navigate("/home")}>
          {"Login"}
        </button>
      </form>
      <form class="links">
        <a href="/signup">Don't have an account?</a>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}