import { useState } from "react";
import { Navigate, Route, BrowserRouter as Router, Routes, useLocation } from "react-router-dom";
import NavBar from "./components/NavBar";
import ProjectRoute from "./components/ProjectRoute";
import CreateProject from "./pages/CreateProject";
import Home from "./pages/Home";
import JoinProject from "./pages/JoinProject";
import Login from "./pages/Login";
import Projects from "./pages/Projects";
import Resources from "./pages/Resources";
import Signup from "./pages/Signup";

function Layout({ children, authenticated, onLogout }) {
  const location = useLocation();
  const hideNavbar = ['/', '/login', '/signup'].includes(location.pathname);

  return (
    <>
      {!hideNavbar && <NavBar authenticated={authenticated} onLogout={onLogout} />}
      {children}
    </>
  );
}

function App() {
  const [authenticated, setAuthenticated] = useState(() => {
    return !!localStorage.getItem("access_token");
  });

  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user_id");
    localStorage.removeItem("returnPath");
    localStorage.removeItem("intendedPage");
    setAuthenticated(false);
  };

  return (
    <Router>
      <Layout authenticated={authenticated} onLogout={logout}>
        <Routes>
          <Route path="/" element={authenticated ? <Navigate to="/home" /> : <Login setAuthenticated={setAuthenticated} />} />
          <Route path="/login" element={<Login setAuthenticated={setAuthenticated} />} />
          <Route path="/signup" element={<Signup />} />
          
          <Route path="/home" element={<ProjectRoute><Home /></ProjectRoute>} />
          <Route path="/join-project" element={<ProjectRoute><JoinProject setAuthenticated={setAuthenticated} /></ProjectRoute>} />
          <Route path="/projects" element={<ProjectRoute><Projects setAuthenticated={setAuthenticated} /></ProjectRoute>} />
          <Route path="/create-project" element={<ProjectRoute><CreateProject /></ProjectRoute>} />
          <Route path="/resources" element={<ProjectRoute><Resources setAuthenticated={setAuthenticated} /></ProjectRoute>} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
