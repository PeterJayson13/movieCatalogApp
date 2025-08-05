import { Button, Row, Col, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <section className="vh-100 d-flex align-items-center bg-gradient">
      <Container>
        <Row className="justify-content-center">
          <Col md={10} lg={8} className="text-center">
            <h1 className="display-4 fw-bold mb-4 text-primary">Welcome to MovieCatalog</h1>
            <p className="lead mb-5 text-muted">
              Browse movies, share your thoughts, and explore a growing collection curated by admins. 
              Whether you're here to discover or contribute, this is your movie hub.
            </p>

            <div className="d-flex flex-column flex-md-row justify-content-center gap-3">
              <Link to="/movies" className="btn btn-primary btn-lg px-4 py-2">
                Browse Movies
              </Link>
              <Link to="/admin" className="btn btn-outline-dark btn-lg px-4 py-2">
                Admin Panel
              </Link>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
}
