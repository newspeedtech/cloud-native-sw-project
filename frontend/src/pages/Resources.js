import { useEffect, useState } from "react";

export default function Resources({ setAuthenticated }) {
  const [resources, setResources] = useState([]);
  const [message, setMessage] = useState("");
  const [projectMap, setProjectMap] = useState({}); // projectid -> projectname

  useEffect(() => {
    // Fetch resources and projects so we can show project names
    (async () => {
      await fetchResources();
      await fetchProjects();
    })();
  }, []);

  const fetchResources = async () => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      setMessage("You must be signed in to view resources.");
      return;
    }

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
        setMessage("Session expired. Please log in again.");
      } else {
        setMessage("Failed to load resources");
      }
    } catch (err) {
      console.error(err);
      setMessage("Network error - can't load resources");
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
        // Build map: projectid -> projectname (or slug)
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
            {resources.length === 0 ? (
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
        {message && <p>{message}</p>}
      </div>
    </div>
  );
}
