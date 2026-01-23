import { useState } from "react";
import NavBar from "./../components/NavBar";

export default function CreateProject() {
  const [projectname, setProjectName] = useState("");
  const [projectid, setProjectId] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      setMessage("You must be signed in to create a project.");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ projectname, projectid, description }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage(`Project created! ID: ${data.project_id}`);
        setProjectName("");
        setProjectId("");
        setDescription("");
      } else {
        setMessage(data.error || "Error creating project");
      }
    } catch (err) {
      console.error(err);
      setMessage("Network error");
    }
  };

  return (
    <div>
      <NavBar />
      <div style={{textAlign: "center"}}>
      <h1>Create Project</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="text" name="projectname" class="text-field"
            placeholder="Project Name"
            value={projectname}
            onChange={(e) => setProjectName(e.target.value)}
            required
          />
        </div>

        <div>
          <input
            type="text" name="projectid" class="text-field"
            placeholder="Project Id"
            value={projectid}
            onChange={(e) => setProjectId(e.target.value)}
            required
          />
        </div>

        <div>
          <input
            type="text" name="description" class="text-field"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <button type="submit">Create Project</button>
      </form>
      {message && <p>{message}</p>}
    </div>
    </div>
  );
}