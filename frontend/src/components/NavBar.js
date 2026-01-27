import { Link, useNavigate } from "react-router-dom";

export default function NavBar({ authenticated, onLogout }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout(); // Call the logout function from App.js
    navigate('/login'); // Navigate to login page
  };

  const handleLoginClick = () => {
    // Clear any stored redirect information when clicking Login directly
    localStorage.removeItem("intendedPage");
    localStorage.removeItem("returnPath");
    navigate("/login");
  };

  return (
    <div>
      <ul>
        <li><Link to="/home">Home</Link></li>
        <li><Link to="/create-project">Create Project</Link></li>
        <li><Link to="/join-project">Join Project</Link></li>
        <li><Link to="/projects">Projects</Link></li>
        <li><Link to="/resources">Resources</Link></li>
        <li style={{ float: "right" }}>
          {authenticated ? (
            <button className="logout-button" onClick={handleLogout}>
              Log Out
            </button>
          ) : (
            <button
              className="logout-button"
              onClick={() => {
              localStorage.removeItem("intendedPage");
              localStorage.removeItem("returnPath");
              handleLoginClick();
              }}
            >Log In
            </button>
          )}
        </li>
      </ul>
    </div>
  );
}