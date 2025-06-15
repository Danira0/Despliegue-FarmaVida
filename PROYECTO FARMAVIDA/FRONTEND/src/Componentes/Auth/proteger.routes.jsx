import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../Auth/auth.jsx';

function ProtectedRoute() {
    const { loading, isAuthenticated, user } = useAuth();
    const location = useLocation();

    if (loading) return <h1>Cargando...</h1>;

    if (!isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    // Si el usuario está autenticado pero no tiene rolId (no debería pasar)
    if (!user?.rolId) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
}

export default ProtectedRoute;