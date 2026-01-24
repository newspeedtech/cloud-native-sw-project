import { useNavigate } from "react-router-dom";

export default function NavBar({ authenticated, onLogout }) {
  const navigate = useNavigate();

  return (
    <div>
      <ul>
        <li><a href="/home">Home</a></li>
        <li><a href="/create-project">Create Project</a></li>
        <li><a href="/projects">Projects</a></li>
        <li><a href="/resources">Resources</a></li>
        <li style={{ float: "right" }}>
          { authenticated ? <button class="logout-button" onClick={onLogout}>Log Out</button>
            : <button class="logout-button" onClick={() => navigate("/home")}>Log In</button> }
        </li>
      </ul>
    </div>
  );
}