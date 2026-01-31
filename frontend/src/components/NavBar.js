import { useNavigate, useLocation } from "react-router-dom";
import { Navbar, Nav, Container, Button } from "react-bootstrap";
import { HddStackFill } from "react-bootstrap-icons";

export default function NavBar({ authenticated, onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  const handleLoginClick = () => {
    localStorage.removeItem("intendedPage");
    localStorage.removeItem("returnPath");
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <Navbar 
      bg="dark" 
      variant="dark" 
      expand="md" 
      sticky="top"
      className="py-2 shadow-sm"
    >
      <Container fluid className="px-3 px-md-4">
        <Navbar.Brand href="/home" className="d-flex align-items-center gap-2 fw-semibold">
          <HddStackFill size={24} className="text-primary" />
          <span>Hardware Checkout</span>
        </Navbar.Brand>
        
        <Navbar.Toggle aria-controls="main-navbar" />
        
        <Navbar.Collapse id="main-navbar">
          <Nav className="mx-auto gap-1">
            <Nav.Link 
              href="/home" 
              className={`px-3 ${isActive('/home') ? 'active fw-medium' : ''}`}
            >
              Home
            </Nav.Link>
            <Nav.Link 
              href="/create-project"
              className={`px-3 ${isActive('/create-project') ? 'active fw-medium' : ''}`}
            >
              Create Project
            </Nav.Link>
            <Nav.Link 
              href="/join-project"
              className={`px-3 ${isActive('/join-project') ? 'active fw-medium' : ''}`}
            >
              Join Project
            </Nav.Link>
            <Nav.Link 
              href="/projects"
              className={`px-3 ${isActive('/projects') ? 'active fw-medium' : ''}`}
            >
              Projects
            </Nav.Link>
            <Nav.Link 
              href="/resources"
              className={`px-3 ${isActive('/resources') ? 'active fw-medium' : ''}`}
            >
              Resources
            </Nav.Link>
          </Nav>
          
          <Nav>
            {authenticated ? (
              <Button 
                variant="outline-light" 
                size="sm"
                onClick={handleLogout}
                className="px-3"
              >
                Log Out
              </Button>
            ) : (
              <Button 
                variant="primary" 
                size="sm"
                onClick={handleLoginClick}
                className="px-3"
              >
                Log In
              </Button>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
