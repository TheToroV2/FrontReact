import { useContext } from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import { AuthContext } from "./pages/Login/AuthContext";

import LoginForm from "./pages/Login/FormularioVerificarContrasena";
import Home from "./pages/Home";
import TipoIndicador from "./pages/Tipoindicador";
import UnidadMediciones from "./pages/UnidadMediciones";
import Sentido from "./pages/sentido";
import Fuente from "./pages/Fuente";
import RepresenVisual from "./pages/RepresenVisual";
import TipoActor from "./pages/TipoActor";
import Frecuencia from "./pages/Frecuencia";
import Indicador from "./pages/Indicador";
import ProyectoIndicador from "./pages/ProyectoIndicador";
import Seccion from "./pages/Seccion";
import Articulo from "./pages/Articulo";

function App() {
  const { roles } = useContext(AuthContext);

  if (!roles) {
    return <div>Loading...</div>;
  }

  const isInvitado = roles.includes("invitado");
  const isAdmin = roles.includes("admin");
  const isValidador = roles.includes("Validador");

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginForm />} />
        <Route path="/login" element={<LoginForm />} />

        {/* Rutas accesibles siempre */}
        <Route path="/indicador" element={<Indicador />} />

        {/* Rutas solo para administradores */}
        {isAdmin && (
          <>
            <Route path="/admin/home" element={<Home />} />
            <Route path="/admin/tipoindicador" element={<TipoIndicador />} />
            <Route path="/admin/unidadmediciones" element={<UnidadMediciones />} />
            <Route path="/admin/sentido" element={<Sentido />} />
            <Route path="/admin/fuente" element={<Fuente />} />
            <Route path="/admin/represenvisual" element={<RepresenVisual />} />
            <Route path="/admin/tipoactor" element={<TipoActor />} />
            <Route path="/admin/frecuencia" element={<Frecuencia />} />
            <Route path="/admin/proyectoindicador" element={<ProyectoIndicador />} />
            <Route path="/admin/seccion" element={<Seccion />} />
            <Route path="/admin/articulo" element={<Articulo />} />

          </>
        )}

        {/* Rutas solo para validadores */}
        {isValidador && (
          <>
            <Route path="/validador/home" element={<Home />} />
            <Route path="/validador/tipoindicador" element={<TipoIndicador />} />
            <Route path="/validador/frecuencia" element={<Frecuencia />} />
            <Route path="/validador/seccion" element={<Seccion />} />
            <Route path="/validador/articulo" element={<Articulo />} />
            {/* Otras rutas de validadores */}
          </>
        )}

        {/* Rutas accesibles para invitados */}
        {isInvitado && (
          <>
            <Route path="/invitado/home" element={<Home />} />
            {/* Agrega otras rutas para invitados */}
          </>
        )}
      </Routes>
    </BrowserRouter>
  );
}

export default App;  // Aquí la exportación por defecto
