import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function ProjectRoute({ children }) {
  const [isChecking, setIsChecking] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    
    if (!token) {
      // Store current path for return after login
      localStorage.setItem("returnPath", location.pathname);
      
      // Store the page name based on the path for display message
      const pageNames = {
        '/home': 'Home',
        '/projects': 'Projects',
        '/create-project': 'Create Project',
        '/join-project': 'Join Project',
        '/resources': 'Resources'
      };
      
      const pageName = pageNames[location.pathname] || 'this';
      localStorage.setItem("intendedPage", pageName);
      
      navigate("/login");
    } else {
      setIsChecking(false);
    }
  }, [navigate, location]);

  if (isChecking) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <p>Loading...</p>
      </div>
    );
  }

  return children;
}
