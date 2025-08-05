import { useState, useEffect, useContext } from 'react';
import { Form, Button } from 'react-bootstrap';
import { Navigate, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import UserContext from '../UserContext';

export default function Register() {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isActive, setIsActive] = useState(false);

  const registerUser = (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      Swal.fire({
        title: 'Password Mismatch',
        icon: 'warning',
        text: 'Password and Confirm Password do not match.'
      });
      return;
    }

    fetch('https://moviecatalogapi-w44t.onrender.com/users/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })
      .then(res => res.json())
      .then(data => {
        if (data.message === 'Registered successfully') {
          Swal.fire({
            title: 'Success!',
            icon: 'success',
            text: 'You may now log in.'
          });
          setEmail('');
          setPassword('');
          setConfirmPassword('');
          navigate('/login');
        } else if (data.message === 'Email already in use') {
          Swal.fire({
            title: 'Registration Failed',
            icon: 'error',
            text: 'An account with this email already exists.'
          });
        } else {
          Swal.fire({
            title: 'Something went wrong',
            icon: 'error',
            text: data.message || 'Please try again later.'
          });
        }
      })
      .catch(error => {
        console.error('Registration fetch error:', error);
        Swal.fire({
          title: 'Registration Error',
          icon: 'error',
          text: 'An error occurred during registration.'
        });
      });
  };

  useEffect(() => {
    const valid =
      email.trim() !== '' &&
      password.trim() !== '' &&
      confirmPassword.trim() !== '' &&
      password === confirmPassword;

    setIsActive(valid);
  }, [email, password, confirmPassword]);

  return user.id !== null ? (
    <Navigate to="/movies" />
  ) : (
    <Form onSubmit={registerUser}>
      <h1 className="my-5 text-center">Register</h1>

      <Form.Group className="mb-3">
        <Form.Label>Email</Form.Label>
        <Form.Control
          type="email"
          placeholder="Enter email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Password</Form.Label>
        <Form.Control
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Confirm Password</Form.Label>
        <Form.Control
          type="password"
          placeholder="Confirm password"
          value={confirmPassword}
          onChange={e => setConfirmPassword(e.target.value)}
          required
        />
      </Form.Group>

      <Button variant="primary" type="submit" disabled={!isActive}>
        Submit
      </Button>
    </Form>
  );
}
