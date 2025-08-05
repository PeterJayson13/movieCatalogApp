import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Container, Form, Button, ListGroup } from 'react-bootstrap';
import Swal from 'sweetalert2';

export default function MovieDetails() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetch(`https://moviecatalogapi-w44t.onrender.com/movies/getMovieById/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => {
        setMovie(data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error('Error fetching movie:', err);
        setIsLoading(false);
      });
  }, [id, token]);

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    fetch(`https://moviecatalogapi-w44t.onrender.com/movies/addComment/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ comment: newComment.trim() })
    })
      .then(res => res.json())
      .then(() => {
        Swal.fire({ icon: 'success', title: 'Comment added' });

        // Re-fetch movie to get updated comment with user info
        return fetch(`https://moviecatalogapi-w44t.onrender.com/movies/getMovieById/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
      })
      .then(res => res.json())
      .then(data => {
        setMovie(data);
        setNewComment('');
      })
      .catch(err => {
        console.error('Error adding comment:', err);
        Swal.fire({ icon: 'error', title: 'Failed to add comment' });
      });
  };

  if (isLoading) return <p className="text-center mt-5">Loading...</p>;
  if (!movie) return <p className="text-center mt-5">Movie not found.</p>;

  return (
    <Container className="mt-5">
      <Card className="shadow">
        <Card.Body>
          <Card.Title>{movie.title}</Card.Title>
          <Card.Subtitle className="mb-2 text-muted">Directed by: {movie.director}</Card.Subtitle>
          <Card.Text><strong>Year:</strong> {movie.year}</Card.Text>
          <Card.Text><strong>Genre:</strong> {movie.genre}</Card.Text>
          <Card.Text><strong>Description:</strong> {movie.description}</Card.Text>
        </Card.Body>
      </Card>

      <Card className="mt-4">
        <Card.Header>Comments</Card.Header>
        <ListGroup variant="flush">
          {movie.comments?.length > 0 ? (
            [...movie.comments].reverse().map((c, index) => (
              <ListGroup.Item key={index}>
                <strong>{c.userId?.email || 'Unknown User'}:</strong> {c.comment}
              </ListGroup.Item>
            ))
          ) : (
            <ListGroup.Item>No comments yet.</ListGroup.Item>
          )}
        </ListGroup>
      </Card>

      {token && (
        <Form className="mt-3" onSubmit={handleCommentSubmit}>
          <Form.Group>
            <Form.Label>Add a Comment</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write your comment..."
              required
            />
          </Form.Group>
          <Button type="submit" className="mt-2">Submit Comment</Button>
        </Form>
      )}
    </Container>
  );
}
