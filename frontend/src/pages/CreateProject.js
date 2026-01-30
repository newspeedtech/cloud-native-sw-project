import { useState } from "react";
import useFeedback from "../hooks/useFeedback";

export default function CreateProject() {
  const { FeedbackDisplay, showSuccess, showError } = useFeedback({width: "350px", marginTop: "30px"});
  const [projectname, setProjectName] = useState("");
  const [projectslug, setProjectSlug] = useState("");
  const [projectdescription, setProjectDescription] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("access_token");

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
        showSuccess(`Project created! ID: ${data.project_id}`);
        setProjectName("");
        setProjectSlug("");
        setProjectDescription("");
      } else {
        showError(data.error || "Error creating project");
      }
    } catch (err) {
      console.error(err);
      showError("Network error");
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
      <FeedbackDisplay />
      </div>
    </div>
  );
}