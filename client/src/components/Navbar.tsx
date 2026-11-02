import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <Link to="/" className="brand">
        TP MERN
      </Link>
      <div className="nav-links">
        {user ? (
          <>
            <NavLink to="/products">Productos</NavLink>
            {/* El link solo se muestra al admin; igual la ruta y la API están protegidas aparte */}
            {user.role === "admin" && <NavLink to="/admin">Admin</NavLink>}
            <span className="nav-user">
              {user.name} <small>({user.role})</small>
            </span>
            <button className="btn-secondary" onClick={handleLogout}>
              Salir
            </button>
          </>
        ) : (
          <>
            <NavLink to="/login">Ingresar</NavLink>
            <NavLink to="/register">Registrarse</NavLink>
          </>
        )}
      </div>
    </nav>
  );
}
