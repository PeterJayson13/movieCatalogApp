import { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AppNavbar from './components/AppNavbar';
import Home from './pages/Home';
import MovieCatalog from './pages/MovieCatalog';
import MovieDetails from './pages/MovieDetails';
import AdminPage from './pages/AdminPage';
import Error from './pages/Error';
import Login from './pages/Login';
import Logout from './pages/Logout';
import Register from './pages/Register';
import './App.css';
import { UserProvider } from './UserContext';

const baseURL = process.env.REACT_APP_BASE_URL;

function App() {
  const [user, setUser] = useState({ id: null, isAdmin: null });

  const unsetUser = () => {
    localStorage.clear();
    setUser({ id: null, isAdmin: null });
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetch(`${baseURL}/users/details`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => {
          if (data._id) {
            setUser({
              id: data._id,
              isAdmin: data.isAdmin
            });
          } else {
            unsetUser();
          }
        })
        .catch(() => unsetUser());
    }
  }, []);

  return (
    <UserProvider value={{ user, setUser, unsetUser }}>
      <Router>
        <AppNavbar />
        <Container>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/movies" element={<MovieCatalog />} />
            <Route path="/movies/:id" element={<MovieDetails />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="*" element={<Error />} />
          </Routes>
        </Container>
      </Router>
    </UserProvider>
  );
}

export default App;
