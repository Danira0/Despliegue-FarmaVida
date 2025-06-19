import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate, useLocation, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

import Login from './Componentes/login/login.jsx';
import Register from './Componentes/registro/register';
import OlvidoContrasena from './Componentes/OlvidoPassword/OlvidoContrasena.jsx';

import Homeadmi from './Componentes/home/homeadmi';
import Homeemple from './Componentes/home/homeemple';

import Proveedor from './Componentes/Admin/proveedores/proveedor.jsx';
import Medicamento from './Componentes/inventario/Medicamentos/admin/medicamento.jsx';
import Caducidad from './Componentes/inventario/Medicamentos/admin/medicaVencimiento/medicaVencimiento.jsx';
import Stockminimo from './Componentes/inventario/Medicamentos/admin/stockMinimo/stockminimo.jsx';
import Movimiento from './Componentes/inventario/Movimiento/movimiento.jsx';
import Informes from './Componentes/Informe/infromes.jsx';

import Entradas from './Componentes/inventario/Movimiento/filtroMovimiento/Entradas.jsx';
import Salidas from './Componentes/inventario/Movimiento/filtroMovimiento/Salidas.jsx';

import UserCrud from './Componentes/Admin/gestion.user/User.crud/admi.crud.jsx';
import GestionUsu from './Componentes/Admin/gestion.user/gestion.user.jsx';
import Emplecrud from './Componentes/Admin/gestion.user/User.crud/emple.crud.jsx';

import UserImagen from './Componentes/imagenUser/userImagen.jsx';

import { AuthProvider, useAuth } from './Componentes/Auth/auth.jsx';
import ProtectedRoute from './Componentes/Auth/proteger.routes.jsx';

function AppWrapper() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleBackButton = (event) => {
      if (location.pathname === '/homeadmi' || location.pathname === '/homeemple') {
        event.preventDefault();
        const confirmLogout = window.confirm('¿Estás seguro de que quieres salir?');
        if (confirmLogout) {
          logout();
          navigate('/'); 
        } else {
          navigate(1); 
        }
      }
    };

    window.addEventListener('popstate', handleBackButton);

    return () => {
      window.removeEventListener('popstate', handleBackButton);
    };
  }, [logout, navigate, location.pathname]);

  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/olvidoContrasena" element={<OlvidoContrasena />} />

      <Route element={<ProtectedRoute />}>
        {/* Rutas accesibles para administradores */}
        <Route path="/homeadmi" element={
          user?.rolId === 1 ? <Homeadmi /> : <Navigate to={user?.rolId === 2 ? "/homeemple" : "/"} />
        } />
        <Route path="/proveedor" element={
          user?.rolId === 1 ? <Proveedor /> : <Navigate to={user?.rolId === 2 ? "/homeemple" : "/"} />
        } />
        <Route path="/gestion_usuario" element={
          user?.rolId === 1 ? <GestionUsu /> : <Navigate to={user?.rolId === 2 ? "/homeemple" : "/"} />
        } />
        <Route path="/user_crud" element={
          user?.rolId === 1 ? <UserCrud /> : <Navigate to={user?.rolId === 2 ? "/homeemple" : "/"} />
        } />
        <Route path="/empleado_crud" element={
          user?.rolId === 1 ? <Emplecrud /> : <Navigate to={user?.rolId === 2 ? "/homeemple" : "/"} />
        } />

        {/* Rutas accesibles para empleados */}
        <Route path="/homeemple" element={
          user?.rolId === 2 ? <Homeemple /> : <Navigate to={user?.rolId === 1 ? "/homeadmi" : "/"} />
        } />

        {/* Rutas accesibles para ambos roles */}
        <Route path="/medicamento" element={<Medicamento />} />
        <Route path="/filtroEntradas" element={<Entradas />} />
        <Route path="/filtroSalidas" element={<Salidas />} />
        <Route path="/caducidad" element={<Caducidad />} />
        <Route path="/stockMinimo" element={<Stockminimo />} />
        <Route path="/movimiento" element={<Movimiento />} />
        <Route path="/informes" element={<Informes />} />
        <Route path="/imagenUsuario" element={<UserImagen />} />

        {/* Ruta de fallback para rutas no definidas */}
          <Route
          path="*"
          element={
            user?.rolId === 1 ? (
              <Navigate to="/homeadmi" />
            ) : user?.rolId === 2 ? (
              <Navigate to="/homeemple" />
            ) : (
              <Navigate to="/" />
            )
          }
        />
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppWrapper />
      </Router>
    </AuthProvider>
  );
}

export default App;