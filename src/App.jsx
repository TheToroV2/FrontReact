import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";  
import TipoIndicador from "./pages/Tipoindicador";
import UnidadMediciones from "./pages/UnidadMediciones";
import Sentido from "./pages/sentido"; // ✅ Importa su propio componente
import Fuente from "./pages/Fuente";
import RepresenVisual from "./pages/RepresenVisual";
import TipoActor from "./pages/TipoActor";
import Frecuencia from "./pages/Frecuencia";
import Indicador from "./pages/Indicador";
import ProyectoIndicador from "./pages/ProyectoIndicador";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/tipoindicador" element={<TipoIndicador />} />
        <Route path="/unidadmediciones" element={<UnidadMediciones />} />
        <Route path="/Sentido" element={<Sentido />} />
        <Route path="/fuente" element={<Fuente />} />
        <Route path="/represenvisual" element={<RepresenVisual />} />
        <Route path="/tipoactor" element={<TipoActor />} />
        <Route path="/frecuencia" element={<Frecuencia />} />
        <Route path="/indicador" element={<Indicador/>} />
        <Route path="/ProyectoIndicador" element={<ProyectoIndicador/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
