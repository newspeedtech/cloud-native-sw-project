import { useEffect, useState } from "react";
import { Form, Button } from "react-bootstrap";
import useFeedback from "../hooks/useFeedback";
import './AuthStyles.css';

export default function Signup() {
  const { FeedbackDisplay, showSuccess, showError } = useFeedback({ glass: true });
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
      const res = await fetch("http://localhost:5001/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, user_id: userId, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Signup failed");
      }

      showSuccess("Account created successfully! Please log in.");
      setUsername("");
      setUserId("");
      setPassword("");
    } catch (err) {
      showError(err.message);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="glass-card">
          <div className="auth-header">
            <h1>Create Account</h1>
            <p>Join us and start managing your projects</p>
          </div>
          
          <FeedbackDisplay />
          
          <Form onSubmit={handleSubmit} className="auth-form">
            <Form.Group className="mb-4" controlId="username">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                placeholder="Choose a username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="glass-input"
                required
              />
            </Form.Group>

            <Form.Group className="mb-4" controlId="userId">
              <Form.Label>User ID</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter a unique user ID"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                className="glass-input"
                required
              />
            </Form.Group>

            <Form.Group className="mb-4" controlId="password">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Create a strong password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="glass-input"
                required
              />
            </Form.Group>

            <Button type="submit" className="auth-button w-100">
              Create Account
            </Button>
          </Form>
          
          <div className="auth-footer">
            <span>Already have an account? </span>
            <a href="/login" className="auth-link">
              Sign in
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
