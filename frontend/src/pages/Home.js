import { useNavigate } from "react-router-dom";

export default function Home( {setAuthenticated} ) {
  const nav = useNavigate()
  return (
    <div style={{ textAlign: 'center' }}>
      <h1>Hardware Checkout System</h1>
      <p>You are now logged in!</p>
      <div style={{ marginTop : '30px' }} >
        <button onClick={() => nav('/create-project')}>Create Project</button>
        <button onClick={() => nav('/projects')}>View Projects</button>
        <button onClick={() => nav('/resources')}>View Resources</button>
      </div>

      <div style={{ marginTop : '30px' }} >
        <button onClick={() => nav('/')}>Log Out</button>
      </div>
    </div>
  );
}
