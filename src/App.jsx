import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";  
import TipoIndicador from "./pages/TipoIndicador";
import UnidadMediciones from "./pages/UnidadMediciones";
import Sentido from "./pages/sentido"; // ✅ Importa su propio componente
import Fuente from "./pages/Fuente";
import RepresenVisual from "./pages/RepresenVisual";
import TipoActor from "./pages/TipoActor";
import Frecuencia from "./pages/Frecuencia";
import Variable from "./pages/Variable";

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
        <Route path="/actor" element={<Actor />} />
        <Route path="/variable" element={<Variable />} />
        <Route path="/indicador" element={<Indicador />} />
        <Route path="/fuentesporindicador" element={<FuentesPorIndicador />} />
        <Route path="/variablesporindicador" element={<VariablesPorIndicador />} />
        <Route path="/resultadoindicador" element={<ResultadoIndicador />} />
        <Route path="/represenvisualporindicador" element={<RepresenVisualPorIndicador />} />
        <Route path="/variable" element={<Variable />} />
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;
