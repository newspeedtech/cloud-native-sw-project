
import { useState } from "react";
import { Navigate, Route, BrowserRouter as Router, Routes } from "react-router-dom";
import NavBar from "./components/NavBar";
import ProjectRoute from "./components/ProjectRoute";
import CreateProject from "./pages/CreateProject";
import Home from "./pages/Home";
import JoinProject from "./pages/JoinProject";
import Login from "./pages/Login";
import Projects from "./pages/Projects";
import Resources from "./pages/Resources";
import Signup from "./pages/Signup";

function App() {
  const [authenticated, setAuthenticated] = useState(() => {
    return !!localStorage.getItem("access_token");
  });

  // Logout function - no navigation here
  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user_id");
    localStorage.removeItem("returnPath");
    localStorage.removeItem("intendedPage");
    setAuthenticated(false);
  };

  return (
    <Router>
      {/* NavBar always renders, shows different content based on authenticated prop */}
      <NavBar authenticated={authenticated} onLogout={logout} />
      <Routes>
        {/* Public routes */}
        <Route path="/" element={authenticated ? <Navigate to="/home"/> : <Login setAuthenticated={setAuthenticated} authenticated={authenticated} /> } />
        <Route path="/login" element={<Login setAuthenticated={setAuthenticated} authenticated={authenticated} />} />
        <Route path="/signup" element={<Signup setAuthenticated={setAuthenticated} authenticated={authenticated} />} />
        
        {/* Protected routes - wrapped in ProjectRoute */}
        <Route
          path="/home"
          element={
            <ProjectRoute>
              <Home setAuthenticated={setAuthenticated} />
            </ProjectRoute>
          }
        />
        <Route
          path="/join-project"
          element={
            <ProjectRoute>
              <JoinProject setAuthenticated={setAuthenticated} />
            </ProjectRoute>
          }
        />
        <Route
          path="/projects"
          element={
            <ProjectRoute>
              <Projects setAuthenticated={setAuthenticated} />
            </ProjectRoute>
          }
        />
        <Route
          path="/create-project"
          element={
            <ProjectRoute>
              <CreateProject setAuthenticated={setAuthenticated} />
            </ProjectRoute>
          }
        />
        <Route
          path="/resources"
          element={
            <ProjectRoute>
              <Resources setAuthenticated={setAuthenticated} />
            </ProjectRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;

