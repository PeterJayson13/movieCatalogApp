import { useEffect, useState, useContext } from 'react';
import { Container, Row, Col, Form, Button, Spinner, Alert } from 'react-bootstrap';
import Swal from 'sweetalert2';
import MoviesCard from '../components/MoviesCard';
import UserContext from '../UserContext';
import { Navigate } from 'react-router-dom';

export default function AdminPage() {
  const { user } = useContext(UserContext);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [title, setTitle] = useState('');
  const [director, setDirector] = useState('');
  const [year, setYear] = useState('');
  const [genre, setGenre] = useState('');
  const [description, setDescription] = useState('');

  const token = localStorage.getItem('token');

  const fetchMovies = () => {
    setLoading(true);
    setError(null);

    fetch('https://moviecatalogapi-w44t.onrender.com/movies/getMovies', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(async res => {
        if (!res.ok) {
          const text = await res.text();
          throw new Error(`Server Error: ${res.status} - ${text}`);
        }
        return res.json();
      })
      .then(data => {
        setMovies(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching movies:', err);
        setError('Failed to fetch movies.');
        setLoading(false);
      });
  };

  const handleAddMovie = (e) => {
    e.preventDefault();

    fetch('https://moviecatalogapi-w44t.onrender.com/movies/addMovie', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        title,
        director,
        year,
        genre,
        description
      })
    })
      .then(async res => {
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || 'Failed to add movie');
        }

        Swal.fire({
          icon: 'success',
          title: 'Movie added successfully!'
        });

        setTitle('');
        setDirector('');
        setYear('');
        setGenre('');
        setDescription('');
        fetchMovies(); // Refresh movie list
      })
      .catch(err => {
        console.error('Add movie error:', err);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: err.message || 'Something went wrong.'
        });
      });
  };

  useEffect(() => {
    if (user?.isAdmin) {
      fetchMovies();
    }
  }, [user]);

  if (!user || !user.isAdmin) {
    return <Navigate to="/" />;
  }

  return (
    <Container className="my-5">
      <h2 className="text-center mb-4">Admin Panel - Manage Movies</h2>

      <Form onSubmit={handleAddMovie} className="mb-5">
        <Row className="g-3">
          <Col md={6}>
            <Form.Group>
              <Form.Label>Title</Form.Label>
              <Form.Control value={title} onChange={e => setTitle(e.target.value)} required />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group>
              <Form.Label>Director</Form.Label>
              <Form.Control value={director} onChange={e => setDirector(e.target.value)} required />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group>
              <Form.Label>Year</Form.Label>
              <Form.Control type="text" value={year} onChange={e => setYear(e.target.value)} required />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group>
              <Form.Label>Genre</Form.Label>
              <Form.Control value={genre} onChange={e => setGenre(e.target.value)} required />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group>
              <Form.Label>Description</Form.Label>
              <Form.Control as="textarea" rows={1} value={description} onChange={e => setDescription(e.target.value)} required />
            </Form.Group>
          </Col>
        </Row>
        <Button variant="success" type="submit" className="mt-3">
          Add Movie
        </Button>
      </Form>

      {loading ? (
        <div className="text-center">
          <Spinner animation="border" role="status" />
          <span className="ms-2">Loading movies...</span>
        </div>
      ) : error ? (
        <Alert variant="danger" className="text-center">
          {error}
        </Alert>
      ) : (
        <Row>
          {movies.length > 0 ? (
            movies.map(movie => (
              <Col key={movie._id} md={6} lg={4} className="mb-4">
                <MoviesCard movie={movie} onUpdate={fetchMovies} />
              </Col>
            ))
          ) : (
            <p className="text-center">No movies available.</p>
          )}
        </Row>
      )}
    </Container>
  );
}
