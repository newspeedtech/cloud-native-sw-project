
import { useState } from "react";
import { Navigate, Route, BrowserRouter as Router, Routes } from "react-router-dom";
import NavBar from './components/NavBar';
import CreateProject from "./pages/CreateProject";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Projects from "./pages/Projects";
import Resources from "./pages/Resources";
import Signup from "./pages/Signup";
import JoinProject from "./pages/JoinProject";

function App() {
  const [authenticated, setAuthenticated] = useState(() => {
    return !!localStorage.getItem('access_token');
  });

  // Logout function
  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_id');
    setAuthenticated(false);
  };

  return (
    <Router>
      {authenticated && <NavBar authenticated={authenticated} onLogout={logout} />}
      <Routes>
        <Route path="/" element={authenticated ? <Navigate to="/home"/> : <Login setAuthenticated={setAuthenticated} /> } />
        <Route path="/login" element={authenticated ? <Navigate to="/home" /> : <Login setAuthenticated={setAuthenticated} />} />
        <Route path="/signup" element={authenticated ? <Navigate to="/home" /> : <Signup setAuthenticated={setAuthenticated} />} />
        <Route path="/home" element={authenticated ? <Home setAuthenticated={setAuthenticated} /> : <Navigate to="/" /> } />
        <Route path="/projects" element={authenticated ? <Projects setAuthenticated={setAuthenticated} /> : <Navigate to="/" /> } />
        <Route path="/resources" element={authenticated ? <Resources setAuthenticated={setAuthenticated} /> : <Navigate to="/" /> } />
        <Route path="/create-project" element={authenticated ? <CreateProject setAuthenticated={setAuthenticated} /> : <Navigate to="/" /> } />
        <Route path="/join-project" element={authenticated ? <JoinProject setAuthenticated={setAuthenticated} /> : <Navigate to="/" /> } />
      </Routes>
    </Router>
  );
}

export default App;
