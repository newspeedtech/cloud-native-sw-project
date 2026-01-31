import { useEffect, useState } from "react";
import { Container, Table, Spinner, Badge } from "react-bootstrap";
import useFeedback from "../hooks/useFeedback";

export default function Resources({ setAuthenticated }) {
  const { FeedbackDisplay, showError } = useFeedback();
  const [resources, setResources] = useState([]);
  const [projectMap, setProjectMap] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResources = async () => {
      const token = localStorage.getItem("access_token");

      try {
        const res = await fetch("http://localhost:5000/hardware", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.ok) {
          const data = await res.json();
          setResources(data);
        } else if (res.status === 401) {
          setAuthenticated(false);
          showError("Session expired. Please log in again.");
        } else {
          showError("Failed to load resources");
        }
      } catch (err) {
        console.error(err);
        showError("Network error - can't load resources");
      } finally {
        setLoading(false);
      }
    };

    const fetchProjects = async () => {
      const token = localStorage.getItem("access_token");
      if (!token) return;

      try {
        const res = await fetch("http://localhost:5000/projects", {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
          const data = await res.json();
          const map = {};
          data.forEach((p) => {
            map[p.id] = p.name || p.slug || p.id;
          });
          setProjectMap(map);
        } else if (res.status === 401) {
          setAuthenticated(false);
        }
      } catch (err) {
        console.error(err);
      }
    };

    const loadData = async () => {
      await fetchProjects();
      await fetchResources();
    };

    loadData();
  }, [setAuthenticated, showError]);

  const getAvailabilityVariant = (available, capacity) => {
    const ratio = available / capacity;
    if (ratio > 0.5) return "success";
    if (ratio > 0.2) return "warning";
    return "danger";
  };

  return (
    <Container>
      <div className="text-center mb-4">
        <h1>Resources</h1>
        <p className="text-muted">View all available hardware resources</p>
      </div>
      
      <FeedbackDisplay />
      
      <Table striped bordered hover responsive className="shadow-sm">
        <thead className="table-dark">
          <tr>
            <th>Name</th>
            <th>Project</th>
            <th>Description</th>
            <th>Capacity</th>
            <th>Available</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="5" className="text-center py-4">
                <Spinner animation="border" role="status" variant="primary">
                  <span className="visually-hidden">Loading...</span>
                </Spinner>
                <p className="mt-2 mb-0">Loading resources...</p>
              </td>
            </tr>
          ) : resources.length === 0 ? (
            <tr>
              <td colSpan="5" className="text-center py-4 text-muted">
                No resources found
              </td>
            </tr>
          ) : (
            resources.map((r) => (
              <tr key={r._id}>
                <td><strong>{r.name}</strong></td>
                <td>
                  {projectMap[r.project_id] ? (
                    <Badge bg="info">{projectMap[r.project_id]}</Badge>
                  ) : (
                    <span className="text-muted">Unassigned</span>
                  )}
                </td>
                <td>{r.description}</td>
                <td>{r.capacity}</td>
                <td>
                  <Badge bg={getAvailabilityVariant(r.available, r.capacity)}>
                    {r.available} / {r.capacity}
                  </Badge>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>
    </Container>
  );
}
