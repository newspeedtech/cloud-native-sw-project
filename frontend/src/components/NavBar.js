import { useNavigate } from "react-router-dom";

export default function NavBar() {
  const navigate = useNavigate();

  return (
    <div>
      <ul>
        <li><a href="/home">Home</a></li>
        <li><a href="/create-project">Create Project</a></li>
        <li><a href="/projects">Projects</a></li>
        <li><a href="/resources">Resources</a></li>
        <li style={{ float: "right" }}>
          <button class="logout-button" onClick={() => navigate('/login')}>
            {"Log Out"}
          </button>
        </li>
      </ul>
    </div>
  );
}