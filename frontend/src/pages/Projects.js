import { useEffect, useState } from 'react';
import { Container, Table, Spinner, Badge } from 'react-bootstrap';
import useFeedback from "../hooks/useFeedback";

export default function Projects({ setAuthenticated }) {
  const { FeedbackDisplay, showError } = useFeedback();
  const [projects, setProjects] = useState([]);
  const [hardware, setHardware] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getProjects = async () => {
      const token = localStorage.getItem("access_token");
      try {
        const res = await fetch("http://localhost:5001/projects", {
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
      }
    };

    const getHardware = async () => {
      const token = localStorage.getItem("access_token");
      try {
        const res = await fetch("http://localhost:5001/hardware", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });

        if (res.ok) {
          const data = await res.json();
          setHardware(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    const loadAll = async () => {
      await getProjects();
      await getHardware();
    };

    loadAll();
  }, [setAuthenticated, showError]);

  const getProjectCheckouts = (projectId) => {
    return hardware
      .filter((hw) => hw.checkouts && hw.checkouts[projectId] > 0)
      .map((hw) => ({
        name: hw.name,
        quantity: hw.checkouts[projectId],
      }));
  };

  return (
    <Container className="py-4">
      <div className="text-center mb-4">
        <h1>My Projects</h1>
        <p className="text-muted">View and manage all your projects</p>
      </div>
      
      <FeedbackDisplay />
      
      <Table striped bordered hover responsive className="shadow-sm">
        <thead className="table-dark">
          <tr>
            <th>Name</th>
            <th>Slug</th>
            <th>Description</th>
            <th>Owner</th>
            <th>Members</th>
            <th>Hardware Checkouts</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="6" className="text-center py-4">
                <Spinner animation="border" role="status" variant="primary">
                  <span className="visually-hidden">Loading...</span>
                </Spinner>
                <p className="mt-2 mb-0">Loading projects...</p>
              </td>
            </tr>
          ) : projects.length === 0 ? (
            <tr>
              <td colSpan="6" className="text-center py-4 text-muted">
                No projects found. Create or join a project to get started.
              </td>
            </tr>
          ) : (
            projects.map((project) => {
              const checkouts = getProjectCheckouts(project.id);
              return (
                <tr key={project.id}>
                  <td><strong>{project.name}</strong></td>
                  <td><code>{project.slug}</code></td>
                  <td>{project.description}</td>
                  <td>{project.owner}</td>
                  <td>
                    {Array.isArray(project.users) ? (
                      project.users.map((user, index) => (
                        <Badge key={index} bg="secondary" className="me-1">
                          {user}
                        </Badge>
                      ))
                    ) : (
                      project.users
                    )}
                  </td>
                  <td>
                    {checkouts.length > 0 ? (
                      <div>
                        {checkouts.map((checkout) => (
                          <div key={checkout.name}>
                            <Badge bg="info" className="me-2">
                              {checkout.name}: {checkout.quantity}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span className="text-muted">None</span>
                    )}
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </Table>
    </Container>
  );
}
