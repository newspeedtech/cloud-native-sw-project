import { Navigate, useState } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import CreateProject from "./pages/CreateProject";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Resources from "./pages/Resources";
import Signup from "./pages/Signup";

function App() {
  const [authenticated, setAuthenticated] = useState(false)
  return (
    <Router>
      <Routes>
        <Route path="/" element={authenticated ? <Navigate to="/home"/> : <Login setIsLoggedIn={setAuthenticated} /> } />
        <Route path="/login" element={authenticated ? <Navigate to="/home" /> : <Login setIsLoggedIn={setAuthenticated} />} />
        <Route path="/signup" element={authenticated ? <Navigate to="/home" /> : <Signup /> } />
        <Route path="/home" element={authenticated ? <Home setIsLoggedIn={setAuthenticated} /> : <Navigate to="/" /> } />
        <Route path="/resources" element={authenticated ? <Resources setIsLoggedIn={setAuthenticated} /> : <Navigate to="/" /> } />
        <Route path="/create-project" element={authenticated ? <CreateProject setIsLoggedIn={setAuthenticated} /> : <Navigate to="/" /> } />
      </Routes>
    </Router>
  );
}

export default App;
