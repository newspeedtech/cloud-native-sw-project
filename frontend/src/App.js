
import { useState } from "react";
import { Navigate, Route, BrowserRouter as Router, Routes } from "react-router-dom";
import CreateProject from "./pages/CreateProject";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Projects from "./pages/Projects";
import Resources from "./pages/Resources";
import Signup from "./pages/Signup";

function App() {
  // Setting to true to test pages
  const [authenticated, setAuthenticated] = useState(true)
  return (
    <Router>
      <Routes>
        <Route path="/" element={authenticated ? <Navigate to="/home"/> : <Login setIsLoggedIn={setAuthenticated} /> } />
        {/* Commenting out to keep nav login/out functionality */}
        {/* <Route path="/login" element={authenticated ? <Navigate to="/home" /> : <Login setIsLoggedIn={setAuthenticated} />} /> */}
        {/* <Route path="/signup" element={authenticated ? <Navigate to="/home" /> : <Signup /> } /> */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/home" element={authenticated ? <Home setIsLoggedIn={setAuthenticated} /> : <Navigate to="/" /> } />
        <Route path="/projects" element={authenticated ? <Projects setIsLoggedIn={setAuthenticated} /> : <Navigate to="/" /> } />
        <Route path="/resources" element={authenticated ? <Resources setIsLoggedIn={setAuthenticated} /> : <Navigate to="/" /> } />
        <Route path="/create-project" element={authenticated ? <CreateProject setIsLoggedIn={setAuthenticated} /> : <Navigate to="/" /> } />
      </Routes>
    </Router>
  );
}

export default App;
