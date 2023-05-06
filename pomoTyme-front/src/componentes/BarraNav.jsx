import { Link, Route, Routes } from 'react-router-dom';
import { Navbar, Container, Nav, NavDropdown } from 'react-bootstrap';
import Inicio from "./Inicio";
import Login from './usuarios/Login';
import Register from './usuarios/Register';
import Estadisticas from './usuarios/Estadisticas';
import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCalendarDays, faGear } from '@fortawesome/free-solid-svg-icons';
import DropdownMenu from 'react-bootstrap/esm/DropdownMenu';

const BarraNav = () => {
  // Estado para almacenar los datos del usuario logueado
  const [usuario, setUsuario] = useState(null);

  // Función para verificar si hay un usuario logueado y retornar su id
  const isAuthenticated = () => {
    const token = localStorage.getItem('token');
    if (!token) return null;
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.id;
  };

  // Función para cerrar sesión
  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  // Función para obtener los datos del usuario logueado
  const getUsuario = async () => {
    const usuarioId = isAuthenticated();
    if (!usuarioId) return;
    try {
      const response = await fetch(`http://localhost:3000/api/usuarios/${usuarioId}`, {
        headers: {
          'x-auth-token': localStorage.getItem('token')
        }
      });
      const data = await response.json();
      if (response.ok) {
        setUsuario(data.data);
      } else {
        // manejar errores de solicitud
      }
    } catch (error) {
      // manejar errores de red
    }
  };


  useEffect(() => {
    getUsuario();
  }, []);


  return (
    <>
      <Navbar className="navbar-custom navbarIn" expand="lg" collapseOnSelect>
        <Navbar.Brand style={{marginLeft:'30px'}} href="/">
          <p className="pomoLogo">PomoTyme</p>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="navbar-right">
            {usuario ? (
              // Si hay un usuario logueado, mostrar su nombre y un botón para cerrar sesión
              <>
              <Nav.Link as={Link} className="linkmio" to="/estadisticas">
                  Estadisticas <FontAwesomeIcon icon={faCalendarDays} size="1x" />
                  </Nav.Link>

                  <Nav.Link as={Link} className="linkmio" onClick={handleLogout} to="/login">
                  Logout
                  </Nav.Link>
                </>
            ) : (
              // Si no hay usuario logueado, mostrar opciones para iniciar sesión o registrarse
              <>
                <Nav.Link as={Link} className="linkmio" to="/login">
                  Login
                </Nav.Link>
                <Nav.Link as={Link} className="linkmio" to="/register">
                  Register
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Navbar>

      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/estadisticas" element={<Estadisticas />} />
      </Routes>
    </>
  );
};

export default BarraNav;
