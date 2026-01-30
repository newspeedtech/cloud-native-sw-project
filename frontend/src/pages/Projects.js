import { useEffect, useState } from 'react';
import { Loading } from '../components/Loading';
import useFeedback from "../hooks/useFeedback";

export default function Projects({ setAuthenticated }) {
  const { FeedbackDisplay, showError } = useFeedback({width: "350px", marginTop: "30px"});
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getProjects = async (e) => {
      const token = localStorage.getItem("access_token");
      try {
        const res = await fetch("http://localhost:5000/projects", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });

        if (res.ok) {
          const data = await res.json();
          setProjects(data);
        } else if (res.status === 401) {
          setAuthenticated(false);
          showError("Session expired. Please log in again.");
        } else {
          showError('Failed to load projects');
        }
      } catch (err) {
        console.error(err);
        showError("Network error - can't load projects");
      } finally {
        setLoading(false);
      }
    };

    (async () => {
      await getProjects();
    })();
  }, [setAuthenticated, showError]);



  return (
    <div>
      <div style={{ textAlign: "center" }}>
        <h1>Projects Page</h1>
        <p>Below are all of your projects</p>
        <table className="project-table">
          <thead>
              <tr>
                  <th>Name</th>
                  <th>Slug</th>
                  <th>Description</th>
                  <th>Owner</th>
                  <th>Users</th>
              </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '15px' }}>
                  <Loading message = "Loading projects ..."/>
                </td>
              </tr>
              ) : projects.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center' }}>
                  No projects found
                </td>
              </tr>
              ) : (
              projects.map((project) => (
                <tr key={project.id}>
                  <td>{project.name}</td>
                  <td>{project.slug}</td>
                  <td>{project.description}</td>
                  <td>{project.owner}</td>
                  <td>
                    {Array.isArray(project.users) ? (
                      project.users.map((user, index) => (
                        <div key={index}>{user}</div>
                      ))
                    ) : (
                      project.users
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <FeedbackDisplay style={{width: "350px", marginTop: "30px"}} />
    </div>
  );
}
