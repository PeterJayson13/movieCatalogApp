import { Card, Modal, Button, Form } from 'react-bootstrap';
import Swal from 'sweetalert2';
import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import UserContext from '../UserContext';

export default function MovieCard({ movie, onUpdate }) {
  const { _id, title, director, year, description, genre } = movie;

  const [showModal, setShowModal] = useState(false);
  const [updatedTitle, setUpdatedTitle] = useState(title);
  const [updatedDirector, setUpdatedDirector] = useState(director);
  const [updatedYear, setUpdatedYear] = useState(year);
  const [updatedDescription, setUpdatedDescription] = useState(description);
  const [updatedGenre, setUpdatedGenre] = useState(genre);

  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  function deleteMovie(id) {
    fetch(`https://moviecatalogapi-w44t.onrender.com/movies/deleteMovie/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(response => {
        Swal.fire({ icon: "success", title: response.message || "Movie Deleted" });
        onUpdate?.();
      })
      .catch(err => console.error("Delete error:", err));
  }

  function updateMovie(e) {
    e.preventDefault();
    fetch(`https://moviecatalogapi-w44t.onrender.com/movies/updateMovie/${_id}`, {
      method: 'PATCH',
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        title: updatedTitle,
        director: updatedDirector,
        year: updatedYear,
        description: updatedDescription,
        genre: updatedGenre
      })
    })
      .then(res => res.json())
      .then(response => {
        Swal.fire({ icon: "success", title: response.message || "Movie Updated" });
        setShowModal(false);
        onUpdate?.();
      })
      .catch(err => console.error("Update error:", err));
  }

  return (
    <>
      <Card className="mb-3">
        <Card.Body>
          <Card.Title>{title}</Card.Title>
          <Card.Subtitle className="mb-2 text-muted">Directed by: {director}</Card.Subtitle>
          <Card.Text><strong>Year:</strong> {year}</Card.Text>
          <Card.Text><strong>Genre:</strong> {genre}</Card.Text>
          <Card.Text><strong>Description:</strong> {description}</Card.Text>
        </Card.Body>
        <Card.Footer className="d-flex justify-content-between">
          <Button variant="primary" size="sm" onClick={() => navigate(`/movies/${_id}`)}>
            View Details
          </Button>

          {user?.isAdmin && (
            <div>
              <Button
                variant="warning"
                size="sm"
                className="me-2"
                onClick={() => setShowModal(true)}
              >
                Edit
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={() => deleteMovie(_id)}
              >
                Delete
              </Button>
            </div>
          )}
        </Card.Footer>
      </Card>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Movie</Modal.Title>
        </Modal.Header>
        <Form onSubmit={updateMovie}>
          <Modal.Body>
            <Form.Group className="mb-2">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                value={updatedTitle}
                onChange={e => setUpdatedTitle(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Director</Form.Label>
              <Form.Control
                type="text"
                value={updatedDirector}
                onChange={e => setUpdatedDirector(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Year</Form.Label>
              <Form.Control
                type="text"
                value={updatedYear}
                onChange={e => setUpdatedYear(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Genre</Form.Label>
              <Form.Control
                type="text"
                value={updatedGenre}
                onChange={e => setUpdatedGenre(e.t
