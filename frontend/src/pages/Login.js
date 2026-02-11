import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Form, Button, Alert } from 'react-bootstrap';
import useFeedback from "../hooks/useFeedback";
import './AuthStyles.css';

export default function Login({ setAuthenticated }) {
  const { FeedbackDisplay, showError } = useFeedback({ glass: true });
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginMessage, setLoginMessage] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const returnPath = localStorage.getItem("returnPath");
    const intendedPage = localStorage.getItem("intendedPage");

    if (returnPath && intendedPage) {
      setLoginMessage(`Please log in prior to viewing ${intendedPage} page`);
    } else {
      setLoginMessage("");
      localStorage.removeItem("intendedPage");
      localStorage.removeItem("returnPath");
    }
  }, [location]);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, password })
      });

      if (res.ok) {
        const data = await res.json();
        
        localStorage.setItem("access_token", data.access_token);
        localStorage.setItem("user_id", data.user_id);
        
        setAuthenticated(true);

        const returnPath = localStorage.getItem("returnPath");
        
        localStorage.removeItem("intendedPage");
        
        if (returnPath) {
          localStorage.removeItem("returnPath");
          navigate(returnPath);
        } else {
          navigate("/home");
        }
      } else {
        const errorData = await res.json();
        showError(errorData.message || "Login failed");
      }
    } catch (err) {
      console.error(err);
      showError("Network error - please try again");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="glass-card">
          <div className="auth-header">
            <h1>Welcome Back</h1>
            <p>Sign in to continue to your account</p>
          </div>
          
          {loginMessage && (
            <Alert variant="info" className="glass-alert">
              {loginMessage}
            </Alert>
          )}
          
          <FeedbackDisplay />
          
          <Form onSubmit={handleLogin} className="auth-form">
            <Form.Group className="mb-4" controlId="username">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="glass-input"
                required
              />
            </Form.Group>

            <Form.Group className="mb-4" controlId="password">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="glass-input"
                required
              />
            </Form.Group>

            <Button type="submit" className="auth-button w-100">
              Sign In
            </Button>
          </Form>
          
          <div className="auth-footer">
            <span>Don't have an account? </span>
            <a 
              href="/signup"
              onClick={() => {
                localStorage.removeItem("intendedPage");
                localStorage.removeItem("returnPath");
              }}
              className="auth-link"
            >
              Create one
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
