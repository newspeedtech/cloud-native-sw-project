import { useEffect, useState } from "react";
import { Loading } from "../components/Loading";
import useFeedback from "../hooks/useFeedback";

export default function Resources({ setAuthenticated }) {
  const { FeedbackDisplay, showError } = useFeedback({width: "350px", marginTop: "30px"})
  const [resources, setResources] = useState([]);
  const [projectMap, setProjectMap] = useState({}); // projectid -> projectname
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
          // Build map: project id -> project name
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
      } finally {
        setLoading(false);
      }
    };

    (async () => {
      await fetchProjects();
      await fetchResources();
    })();
  }, [setAuthenticated, showError]);

  return (
    <div>
      <div style={{ textAlign: "center" }}>
        <h1>Resources Page</h1>
        <p>View all available resources</p>
        <table className="project-table">
          <thead>
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
                <td colSpan="5" style={{ textAlign: 'center', padding: '15px' }}>
                  <Loading message = "Loading resources ..."/>
                </td>
              </tr>
            ) : resources.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ textAlign: "center" }}>
                  No resources found
                </td>
              </tr>
            ) : (
              resources.map((r) => (
                <tr key={r._id}>
                  <td>{r.name}</td>
                  <td>{projectMap[r.project_id] || "Unassigned"}</td>
                  <td>{r.description}</td>
                  <td>{r.capacity}</td>
                  <td>{r.available}</td>
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
