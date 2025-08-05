import { useEffect, useState } from 'react';
import MoviesCard from '../components/MoviesCard'; 
import { Container, Row, Col } from 'react-bootstrap';

const baseURL = process.env.REACT_APP_BASE_URL;

export default function MovieCatalog() {
  const [movies, setMovies] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetch(`${baseURL}/movies/getMovies`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => setMovies(data))
      .catch(err => console.error("Error fetching movies:", err));
  }, [token]);

  return (
    <Container className="mt-5">
      <h2 className="mb-4 text-center">🎬 Movie Catalog</h2>
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
    </Container>
  );
}
