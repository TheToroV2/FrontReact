import { Link } from "react-router-dom";
import "../styles/Home.css";

const navLinks = [
  { path: "/tipoindicador", label: "Tipo Indicadores" },
  { path: "/unidadmediciones", label: "Unidad de Mediciones" },
  { path: "/sentido", label: "Sentido" },
  { path: "/fuente", label: "Fuente" },
  { path: "/represenvisual", label: "Representación Visual" },
  { path: "/tipoactor", label: "Tipo Actor" },
  { path: "/frecuencia", label: "Frecuencia" },
  { path: "/actor", label: "Actor" },
  { path: "/variable", label: "Variable" },
  { path: "/indicador", label: "Indicador" },
  { path: "/fuentesporindicador", label: "Fuentes por Indicador" },
  { path: "/variablesporindicador", label: "Variables por indicador" },
  { path: "/represenvisualporindicador", label: "Representacion Visual  por Indicador" },
  { path: "/resultadoindicador", label: "Resultado Indicador" }

];

const NavButton = ({ path, label }) => (
  <Link to={path}>
    <button className="btn" aria-label={`Ir a ${label}`}>{label}</button>
  </Link>
);

const Home = () => {
  return (
    <div className="home-container">
      <h1>Base de Datos de Indicadores</h1>
      <p>Base de datos de indicadores. Podrás hacer consultas y más.</p>

      <div className="button-container">
        {navLinks.map(({ path, label }) => (
          <NavButton key={path} path={path} label={label} />
        ))}
      </div>
    </div>
  );
};

export default Home;
