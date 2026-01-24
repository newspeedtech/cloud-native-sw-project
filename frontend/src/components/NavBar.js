import { Link, useNavigate } from "react-router-dom";

export default function NavBar({ authenticated, onLogout }) {
  const navigate = useNavigate();

  return (
    <div>
      <ul>
        <li><Link to="/home">Home</Link></li>
        <li><Link to="/create-project">Create Project</Link></li>
        <li><Link to="/projects">Projects</Link></li>
        <li><Link to="/resources">Resources</Link></li>

        <li style={{ float: "right" }}>
          {authenticated ? (
            <button className="logout-button" onClick={onLogout}>
              Log Out
            </button>
          ) : (
            <button
              className="logout-button"
              onClick={() => navigate("/login")}
            >
              Log In
            </button>
          )}
        </li>
      </ul>
    </div>
  );
}
