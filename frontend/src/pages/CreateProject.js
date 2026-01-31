import { useState } from "react";
import { Container, Card, Form, Button } from "react-bootstrap";
import useFeedback from "../hooks/useFeedback";

export default function CreateProject() {
  const { FeedbackDisplay, showSuccess, showError } = useFeedback();
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
    <Container className="d-flex justify-content-center" style={{ paddingTop: '2rem' }}>
      <Card style={{ width: '100%', maxWidth: '500px' }} className="shadow">
        <Card.Body>
          <Card.Title className="text-center mb-4">
            <h2>Create Project</h2>
          </Card.Title>
          
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="projectName">
              <Form.Label>Project Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter project name"
                value={projectname}
                onChange={(e) => setProjectName(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="projectSlug">
              <Form.Label>Project Slug</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter unique slug (e.g., my-project)"
                value={projectslug}
                onChange={(e) => setProjectSlug(e.target.value)}
                required
              />
              <Form.Text className="text-muted">
                This will be used for others to join your project
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3" controlId="projectDescription">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Describe your project"
                value={projectdescription}
                onChange={(e) => setProjectDescription(e.target.value)}
                required
              />
            </Form.Group>

            <Button variant="primary" type="submit" className="w-100">
              Create Project
            </Button>
          </Form>
          
          <FeedbackDisplay />
        </Card.Body>
      </Card>
    </Container>
  );
}
