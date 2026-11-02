import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import type { Role } from "../types";

interface Props {
  roles?: Role[]; // si se pasa, además de estar logueado hay que tener uno de estos roles
}

// "Guardia" de rutas: envuelve las rutas privadas en App.tsx
export default function ProtectedRoute({ roles }: Props) {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Mientras se valida el token no decidimos nada (si no, un F5 te mandaría al login)
  if (loading) {
    return <p className="center">Cargando...</p>;
  }

  // No logueado -> al login, recordando a dónde quería ir
  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  // Logueado pero sin el rol necesario (ej: user tipeando /admin en la URL)
  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/products" replace />;
  }

  // Pasó los controles: renderiza la ruta hija
  return <Outlet />;
}
