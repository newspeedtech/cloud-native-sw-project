import React from "react";
import { Link } from "react-router-dom";

export default function NavBar() {
  return (
    <nav style={{ marginBottom: "1rem" }}>
      <Link to="/">Home</Link> |{" "}
      <Link to="/signup">Signup</Link> |{" "}
      <Link to="/login">Login</Link> |{" "}
      <Link to="/create-project">Create Project</Link>
    </nav>
  );
}