import { useAuth } from "./AuthContext";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, roles }) {
  const { usuario } = useAuth();

  if (!usuario) return <Navigate to="/login" />;

  const tieneAcceso = usuario.roles.some((rol) => roles.includes(rol));
  return tieneAcceso ? children : <Navigate to="/login" />;
}

export default ProtectedRoute;