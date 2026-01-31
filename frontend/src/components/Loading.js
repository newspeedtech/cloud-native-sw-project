import { Spinner } from "react-bootstrap";

export function Loading({ message = "Loading..." }) {
  return (
    <div className="text-center">
      <Spinner animation="border" role="status" variant="primary">
        <span className="visually-hidden">Loading</span>
      </Spinner>
      <p className="mt-2 mb-0">{message}</p>
    </div>
  );
}
