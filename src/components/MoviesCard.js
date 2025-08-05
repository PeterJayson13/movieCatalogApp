import { Card, Modal, Button, Form } from 'react-bootstrap';
import Swal from 'sweetalert2';
import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import UserContext from '../UserContext';

export default function MoviesCard({ movie, onUpdate }) {
  const { _id, title, director, year, description, genre } = movie;

  const [showModal, setShowModal] = useState(false);
  const [updatedTitle, setUpdatedTitle] = useState(title);
  const [updatedDirector, setUpdatedDirector] = useState(director);
  const [updatedYear, setUpdatedYear] = useState(year);
  const [updatedDescription, setUpdatedDescription] = useState(description);
  const [updatedGenre, setUpdatedGenre] = useState(genre);

  const token = localStorage.getItem('token');
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  const deleteMovie = () => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This movie will be permanently deleted.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Yes, delete it!'
    }).then(result => {
      if (result.isConfirmed) {
        fetch(`https://moviecatalogapi-w44t.onrender.com/movies/deleteMovie/${_id}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
          .then(async res => {
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Delete failed');
            Swal.fire({ icon: 'success', title: 'Movie deleted' });
            if (onUpdate) onUpdate();
          })
          .catch(err => {
            console.error('Delete error:', err);
            Swal.fire({ icon: 'error', title: 'Delete failed', text: err.message });
          });
      }
    });
  };

  const updateMovie = (e) => {
    e.preventDefault();

    fetch(`https://moviecatalogapi-w44t.onrender.com/movies/updateMovie/${_id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
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
      .then(async res => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Update failed');
        Swal.fire({ icon: 'success', title: 'Movie updated' });
        setShowModal(false);
        if (onUpdate) onUpdate();
      })
      .catch(err => {
        console.error('Update error:', err);
        Swal.fire({ icon: 'error', title: 'Update failed', text: err.message });
      });
  };

  return (
    <>
      <Card className="mb-3 shadow-sm">
        <Card.Body>
          <Card.Title>{title}</Card.Title>
          <Card.Subtitle className="mb-2 text-muted">Directed by: {director}</Card.Subtitle>
          <Card.Text><strong>Year:</strong> {year}</Card.Text>
          <Card.Text><strong>Genre:</strong> {genre}</Card.Text>
          <Card.Text><strong>Description:</strong> {description}</Card.Text>
        </Card.Body>
        <Card.Footer className="d-flex justify-content-between align-items-center">
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
                onClick={deleteMovie}
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
                onChange={e => setUpdatedGenre(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={updatedDescription}
                onChange={e => setUpdatedDescription(e.target.value)}
                required
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Save Changes
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
}
