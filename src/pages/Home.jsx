import React, { useContext } from "react";  // Agregar useContext aquí
import { Link } from "react-router-dom";
import { AuthContext } from "./Login/AuthContext";  // Asegúrate de que la ruta sea correcta
import "../styles/Home.css"; // O donde sea que tengas tus estilos


const navLinks = [
  { path: "/tipoindicador", label: "Tipo Indicadores" },
  { path: "/unidadmediciones", label: "Unidad de Mediciones" },
  { path: "/sentido", label: "Sentido" },
  { path: "/fuente", label: "Fuente" },
  { path: "/represenvisual", label: "Representación Visual" },
  { path: "/tipoactor", label: "Tipo Actor" },
  { path: "/frecuencia", label: "Frecuencia" },
  { path: "/indicador", label: "Indicador" },
  { path: "/ProyectoIndicador", label: "ProyectoIndicador" },
  { path: "/Seccion", label: "Seccion" },
  { path: "/Articulo", label: "Articulo" },
];

const NavButton = ({ path, label }) => (
  <Link to={path}>
    <button className="btn" aria-label={`Ir a ${label}`}>{label}</button>
  </Link>
);

const Home = () => {
  const { roles } = useContext(AuthContext);
  
  const isAdmin = roles && roles.includes("admin");
  const isInvitado = roles && roles.includes("invitado");
  const isValidador = roles && roles.includes("Validador");

  const prefix = isAdmin ? "/admin" : isValidador ? "/validador" : isInvitado ? "/invitado" : "";

  return (
    <div className="home-container">
      <h1>Base de Datos de Indicadores</h1>
      <p>Base de datos de indicadores. Podrás hacer consultas y más.</p>

      <div className="button-container">
        {navLinks.map(({ path, label }) => (
          <NavButton key={path} path={`${prefix}${path}`} label={label} />
        ))}
      </div>
    </div>
  );
};

export default Home;  // Aquí está la exportación
