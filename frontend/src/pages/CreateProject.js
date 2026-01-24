import { useState } from "react";

export default function CreateProject( {setAuthenticated}) {
  const [projectname, setProjectName] = useState("");
  const [projectslug, setProjectSlug] = useState("");
  const [projectdescription, setProjectDescription] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("access_token");
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
        body: JSON.stringify({
          name: projectname,
          slug: projectslug,
          description: projectdescription
        }),

      });

      const data = await res.json();
      if (res.ok) {
        setMessage(`Project created! ID: ${data.project_id}`);
        setProjectName("");
        setProjectSlug("");
        setProjectDescription("");
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
      <div style={{textAlign: "center"}}>
      <h1>Create Project</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="text" name="projectname" class="text-field"
            placeholder="name"
            style={{width: "350px"}}
            value={projectname}
            onChange={(e) => setProjectName(e.target.value)}
            required
          />
        </div>

        <div>
          <input
            type="text" name="projectslug" class="text-field"
            placeholder="slug"
            style={{width: "350px"}}
            value={projectslug}
            onChange={(e) => setProjectSlug(e.target.value)}
            required
          />
        </div>

        <div>
          <textarea
            type="text" name="projectdescription" class="text-field"
            style={{resize: "vertical", width: "350px"}}
            placeholder="description"
            value={projectdescription}
            onChange={(e) => setProjectDescription(e.target.value)}
            required
          />
        </div>
        <button class="create-project-button" type="submit">Create Project</button>
      </form>
      {message && <p>{message}</p>}
    </div>
    </div>
  );
}