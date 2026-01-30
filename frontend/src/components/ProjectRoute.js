import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Loading } from './Loading';

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

  // If this doesn't exist then we run the risk of un-authed users
  // seeing glimpses of the web pages
  if (isChecking) {
    return (
      <Loading/>
    );
  }

  return children;
}
