import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Card, Form, Button } from "react-bootstrap";
import useFeedback from "../hooks/useFeedback";

export default function JoinProject({ setAuthenticated }) {
  const [slug, setSlug] = useState("");
  const { FeedbackDisplay, showSuccess, showError } = useFeedback();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("access_token");
    try {
      const res = await fetch(`/api/projects/${slug}/join`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (res.ok) {
        showSuccess(`Successfully joined project: ${data.name}`);
        setSlug("");
        setTimeout(() => navigate("/projects"), 1500);
      } else if (res.status === 401) {
        setAuthenticated(false);
        showError("Session expired. Please log in again.");
      } else {
        showError(data.error || "Failed to join project");
      }
    } catch (err) {
      console.error(err);
      showError("Network error - couldn't join project");
    }
  };

  return (
    <Container className="d-flex justify-content-center" style={{ paddingTop: '2rem' }}>
      <Card style={{ width: '100%', maxWidth: '400px' }} className="shadow">
        <Card.Body>
          <Card.Title className="text-center mb-4">
            <h2>Join a Project</h2>
          </Card.Title>
          <p className="text-center text-muted mb-4">
            Enter a project slug to join an existing project
          </p>
          
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="projectSlug">
              <Form.Label>Project Slug</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter project slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                required
              />
            </Form.Group>

            <Button variant="primary" type="submit" className="w-100">
              Join Project
            </Button>
          </Form>
          
          <FeedbackDisplay />
        </Card.Body>
      </Card>
    </Container>
  );
}
