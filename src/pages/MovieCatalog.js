import { useEffect, useState } from 'react';
import MoviesCard from '../components/MoviesCard'; 
import { Container, Row, Col, Spinner, Alert } from 'react-bootstrap';

export default function MovieCatalog() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      setError('You must be logged in to view the movies.');
      setLoading(false);
      return;
    }

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
        if (Array.isArray(data)) {
          // This is if you change your backend to send an array directly
          setMovies(data);
        } else if (Array.isArray(data.movies)) {
          // This is your current backend response format
          setMovies(data.movies);
        } else {
          setMovies([]);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching movies:", err);
        setError("Failed to fetch movies. Please try again later.");
        setLoading(false);
      });
  }, [token]);

  return (
    <Container className="mt-5">
      <h2 className="mb-4 text-center">🎬 Movie Catalog</h2>

      {loading && (
        <div className="text-center">
          <Spinner animation="border" role="status" />
          <span className="ms-2">Loading movies...</span>
        </div>
      )}

      {error && (
        <Alert variant="danger" className="text-center">
          {error}
        </Alert>
      )}

      {!loading && !error && (
        <Row>
          {movies.length > 0 ? (
            movies.map(movie => (
              <Col key={movie._id} md={6} lg={4} className="mb-4">
                <MoviesCard movie={movie} />
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
