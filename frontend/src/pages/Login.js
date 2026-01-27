import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useFeedback } from "./../components/useFeedback";

export default function Login({ setAuthenticated }) {
  const { feedback, showError } = useFeedback();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginMessage, setLoginMessage] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  // Check for intended page on component mount and when location changes
  useEffect(() => {
    const returnPath = localStorage.getItem("returnPath");
    const intendedPage = localStorage.getItem("intendedPage");

    if (returnPath && intendedPage) {
      // Only show message if both exist (user was redirected from protected route)
      setLoginMessage(`Please log in prior to viewing ${intendedPage} page`);
    } else {
      // Clear message and localStorage if user navigated here directly
      setLoginMessage("");
      localStorage.removeItem("intendedPage");
      localStorage.removeItem("returnPath");
    }
  }, [location]); // Re-run whenever location changes

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, password })
      });

      if (res.ok) {
        const data = await res.json();
        
        // Store token and user info in localStorage
        localStorage.setItem("access_token", data.access_token);
        localStorage.setItem("user_id", data.user_id);
        
        // Update authenticated state
        setAuthenticated(true);

        const returnPath = localStorage.getItem("returnPath");
        
        // Clean up stored values
        localStorage.removeItem("intendedPage");
        
        if (returnPath) {
          localStorage.removeItem("returnPath");
          navigate(returnPath);
        } else {
          // Default redirect to home if no return path
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
    <div>
      {loginMessage && (<p className="login-message">{loginMessage}</p>)}
      <div className="login-form">
        <h1 style={{ color: "white" }}>Login</h1>
        {feedback.message && (
            <p style={{marginBottom: "15px"}}
              className={feedback.type === "error" ? "error-message-box" : "success-message-box"}>
              {feedback.message}
            </p>
        )}
        <form onSubmit={handleLogin}>
          <div>
            <input
              type="text"
              placeholder="Username"
              className="text-field"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Password"
              className="text-field"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button className="button" type="submit">
            Login
          </button>
        </form>
        <form className="links">
          <a href="/signup"
            onClick={() => {
            localStorage.removeItem("intendedPage");
            localStorage.removeItem("returnPath");
            }}
          >Already have an account?</a>
        </form>
      </div>
    </div>
  );
}