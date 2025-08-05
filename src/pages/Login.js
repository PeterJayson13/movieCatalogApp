import { useState, useEffect, useContext } from 'react';
import { Form, Button, Spinner } from 'react-bootstrap';
import { Navigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import UserContext from '../UserContext';

export default function Login() {
  const { user, setUser } = useContext(UserContext);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isActive, setIsActive] = useState(false);
  const [redirect, setRedirect] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  function authenticate(e) {
    e.preventDefault();
    setIsLoading(true);

    fetch('https://moviecatalogapi-w44t.onrender.com/users/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: email.trim(),
        password: password.trim()
      })
    })
      .then(res => res.json())
      .then(data => {
        if (data.access) {
          localStorage.setItem('token', data.access);
          retrieveUserDetails(data.access);
          Swal.fire({
            title: 'Login Successful',
            icon: 'success',
            text: 'Welcome to MovieCatalog!'
          });
        } else {
          setIsLoading(false);
          Swal.fire({
            title: 'Authentication Failed',
            icon: 'error',
            text: 'Check your login details and try again.'
          });
        }
      })
      .catch(error => {
        setIsLoading(false);
        console.error('Login fetch error:', error);
        Swal.fire({
          title: 'Login Error',
          icon: 'error',
          text: 'An error occurred during login. Please try again later.'
        });
      });

    setEmail('');
    setPassword('');
  }

  const retrieveUserDetails = (token) => {
    fetch('https://moviecatalogapi-w44t.onrender.com/users/details', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => {
        setUser({
          id: data._id,
          isAdmin: data.isAdmin
        });
        setRedirect(true);
      })
      .catch(error => {
        console.error('Retrieve user details fetch error:', error);
        setUser({ id: null });
        localStorage.clear();
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    setIsActive(email.trim() !== '' && password.trim() !== '');
  }, [email, password]);

  if (redirect || user.id !== null) {
    return <Navigate to="/movies" />;
  }

  return (
    <Form onSubmit={authenticate}>
      <h1 className="my-5 text-center">Login</h1>

      <Form.Group controlId="userEmail" className="mb-3">
        <Form.Label>Email address</Form.Label>
        <Form.Control
          type="email"
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </Form.Group>

      <Form.Group controlId="password" className="mb-3">
        <Form.Label>Password</Form.Label>
        <Form.Control
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </Form.Group>

      {isLoading ? (
        <Button variant="secondary" disabled className="my-3 w-100">
          <Spinner animation="border" size="sm" className="me-2" />
          Logging in...
        </Button>
      ) : (
        <Button
          variant={isActive ? 'primary' : 'danger'}
          type="submit"
          className="my-3 w-100"
          disabled={!isActive}
        >
          Submit
        </Button>
      )}
    </Form>
  );
}
