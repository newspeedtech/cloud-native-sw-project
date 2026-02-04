import { useEffect, useState } from "react";
import { Container, Table, Spinner, Badge, Form, Button } from "react-bootstrap";
import useFeedback from "../hooks/useFeedback";

export default function Resources({ setAuthenticated }) {
  const { FeedbackDisplay, showError, showSuccess } = useFeedback();
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantities, setQuantities] = useState({});
  const [processing, setProcessing] = useState({});

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
          // Initialize quantities state
          const initialQties = {};
          data.forEach((r) => {
            initialQties[r._id] = { checkout: 1, checkin: 1 };
          });
          setQuantities(initialQties);
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

    fetchResources();
  }, [setAuthenticated, showError]);

  const getAvailabilityVariant = (available, capacity) => {
    const ratio = available / capacity;
    if (ratio > 0.5) return "success";
    if (ratio > 0.2) return "warning";
    return "danger";
  };

  const handleQuantityChange = (hwId, type, value) => {
    setQuantities((prev) => ({
      ...prev,
      [hwId]: {
        ...(prev[hwId] || { checkout: 1, checkin: 1 }),
        [type]: value === "" ? "" : parseInt(value) || 0,
      },
    }));
  };

  const isCheckoutDisabled = (hw) => {
    const qty = quantities[hw._id]?.checkout ?? 1;
    return qty <= 0 || qty > hw.available;
  };

  const isCheckinDisabled = (hw) => {
    const qty = quantities[hw._id]?.checkin ?? 1;
    return qty <= 0 || qty + hw.available > hw.capacity;
  };

  const handleCheckout = async (hwId) => {
    const token = localStorage.getItem("access_token");
    const qty = quantities[hwId]?.checkout ?? 1;

    if (isCheckoutDisabled(resources.find((r) => r._id === hwId))) {
      showError("Invalid quantity");
      return;
    }

    setProcessing((prev) => ({ ...prev, [hwId]: true }));

    try {
      const res = await fetch(`http://localhost:5000/hardware/${hwId}/checkout`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ quantity: qty }),
      });

      if (res.ok) {
        showSuccess(`Checked out ${qty} items`);
        setResources((prev) =>
          prev.map((r) =>
            r._id === hwId ? { ...r, available: r.available - qty } : r
          )
        );
        setQuantities((prev) => ({
          ...prev,
          [hwId]: { ...prev[hwId], checkout: 1 },
        }));
      } else if (res.status === 401) {
        setAuthenticated(false);
        showError("Session expired");
      } else {
        const data = await res.json();
        showError(data.error || "Checkout failed");
      }
    } catch (err) {
      console.error(err);
      showError("Network error");
    } finally {
      setProcessing((prev) => ({ ...prev, [hwId]: false }));
    }
  };

  const handleCheckin = async (hwId) => {
    const token = localStorage.getItem("access_token");
    const qty = quantities[hwId]?.checkin ?? 1;

    if (isCheckinDisabled(resources.find((r) => r._id === hwId))) {
      showError("Invalid quantity");
      return;
    }

    setProcessing((prev) => ({ ...prev, [`${hwId}-checkin`]: true }));

    try {
      const res = await fetch(`http://localhost:5000/hardware/${hwId}/checkin`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ quantity: qty }),
      });

      if (res.ok) {
        showSuccess(`Checked in ${qty} items`);
        setResources((prev) =>
          prev.map((r) =>
            r._id === hwId ? { ...r, available: r.available + qty } : r
          )
        );
        setQuantities((prev) => ({
          ...prev,
          [hwId]: { ...prev[hwId], checkin: 1 },
        }));
      } else if (res.status === 401) {
        setAuthenticated(false);
        showError("Session expired");
      } else {
        const data = await res.json();
        showError(data.error || "Checkin failed");
      }
    } catch (err) {
      console.error(err);
      showError("Network error");
    } finally {
      setProcessing((prev) => ({ ...prev, [`${hwId}-checkin`]: false }));
    }
  };

  return (
    <Container className="py-4">
      <div className="text-center mb-4">
        <h1>Resources</h1>
        <p className="text-muted">View all available hardware resources</p>
      </div>

      <FeedbackDisplay />

      <Table striped bordered hover responsive className="shadow-sm">
        <thead className="table-dark">
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Capacity</th>
            <th>Available</th>
            <th>Checkout</th>
            <th>Checkin</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="6" className="text-center py-4">
                <Spinner animation="border" role="status" variant="primary">
                  <span className="visually-hidden">Loading...</span>
                </Spinner>
                <p className="mt-2 mb-0">Loading resources...</p>
              </td>
            </tr>
          ) : resources.length === 0 ? (
            <tr>
              <td colSpan="6" className="text-center py-4 text-muted">
                No resources found
              </td>
            </tr>
          ) : (
            resources.map((r) => (
              <tr key={r._id}>
                <td>
                  <strong>{r.name}</strong>
                </td>
                <td>{r.description}</td>
                <td>{r.capacity}</td>
                <td>
                  <Badge bg={getAvailabilityVariant(r.available, r.capacity)}>
                    {r.available} / {r.capacity}
                  </Badge>
                </td>
                <td>
                  <div className="d-flex gap-2">
                    <Form.Control
                      type="number"
                      min="1"
                      value={quantities[r._id]?.checkout ?? 1}
                      onChange={(e) =>
                        handleQuantityChange(r._id, "checkout", e.target.value)
                      }
                      disabled={processing[r._id]}
                      style={{
                        opacity: isCheckoutDisabled(r) ? 0.5 : 1,
                        cursor: isCheckoutDisabled(r) ? "not-allowed" : "auto",
                      }}
                      className="w-50"
                    />
                    <Button
                      variant="success"
                      size="sm"
                      onClick={() => handleCheckout(r._id)}
                      disabled={isCheckoutDisabled(r) || processing[r._id]}
                    >
                      {processing[r._id] ? "..." : "Out"}
                    </Button>
                  </div>
                </td>
                <td>
                  <div className="d-flex gap-2">
                    <Form.Control
                      type="number"
                      min="1"
                      value={quantities[r._id]?.checkin ?? 1}
                      onChange={(e) =>
                        handleQuantityChange(r._id, "checkin", e.target.value)
                      }
                      disabled={processing[`${r._id}-checkin`]}
                      style={{
                        opacity: isCheckinDisabled(r) ? 0.5 : 1,
                        cursor: isCheckinDisabled(r) ? "not-allowed" : "auto",
                      }}
                      className="w-50"
                    />
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleCheckin(r._id)}
                      disabled={isCheckinDisabled(r) || processing[`${r._id}-checkin`]}
                    >
                      {processing[`${r._id}-checkin`] ? "..." : "In"}
                    </Button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>
    </Container>
  );
}
